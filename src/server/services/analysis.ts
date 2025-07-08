import { JobAnalysisRequest, AnalysisResult, JobListing } from '../schemas/analysis';
import { logger } from '../utils/logger';
import { chatCompletion } from './ollama';

/**
 * Makes a request to the LLM API
 */
async function llmRequest(messages: Array<{role: string, content: string}>, model: string = 'llama3') {
  try {
    return await chatCompletion(messages, {
      model,
      temperature: 0.3,
    });
  } catch (error) {
    logger.error('LLM API request failed:', error);
    throw error;
  }
}

/**
 * Analyzes a job listing and compares it against a user's profile
 */
export async function analyzeJobListing(
  data: JobAnalysisRequest
): Promise<AnalysisResult> {
  const { job, userProfile, options = {} } = data;
  // Define default options
  const defaultOptions = {
    includeMissingSkills: true,
    includeSuggestions: true,
    detailedAnalysis: false,
    ...options
  };
  
  const { includeMissingSkills, includeSuggestions, detailedAnalysis } = defaultOptions;

  try {
    // Extract skills from job description using LLM
    const extractedSkills = await extractSkillsFromJobDescription(job.description);
    
    // If we have user profile data, perform matching
    let matchScore = 0;
    let matchingSkills: string[] = [];
    let missingSkills: string[] = [];
    let suggestions: string[] = [];
    let scoreBreakdown = {
      skills: 0,
      experience: 0,
      education: 0,
    };

    if (userProfile) {
      // Calculate skill matches
      const userSkillNames = userProfile.skills.map(skill => skill.name.toLowerCase());
      const jobSkillNames = extractedSkills.map(skill => skill.toLowerCase());
      
      matchingSkills = userSkillNames.filter(skill => 
        jobSkillNames.some(jobSkill => 
          jobSkill.includes(skill) || skill.includes(jobSkill)
        )
      );
      
      missingSkills = jobSkillNames.filter(skill => 
        !userSkillNames.some(userSkill => 
          skill.includes(userSkill) || userSkill.includes(skill)
        )
      );

      // Calculate match score (simplified for now)
      const skillMatchRatio = jobSkillNames.length > 0 
        ? matchingSkills.length / jobSkillNames.length 
        : 0;
      
      // Calculate experience match (simplified)
      const experienceMatch = calculateExperienceMatch(job, userProfile);
      
      // Calculate education match (simplified)
      const educationMatch = calculateEducationMatch(job, userProfile);
      
      // Calculate overall score (weighted average)
      matchScore = Math.round(
        (skillMatchRatio * 0.6 + 
         experienceMatch * 0.3 + 
         educationMatch * 0.1) * 100
      );
      
      scoreBreakdown = {
        skills: Math.round(skillMatchRatio * 100),
        experience: Math.round(experienceMatch * 100),
        education: Math.round(educationMatch * 100),
      };

      // Generate suggestions if needed
      if (includeSuggestions) {
        suggestions = await generateSuggestions(job, matchingSkills, missingSkills);
      }
    }

    // Generate detailed analysis if requested
    let detailedAnalysisText = '';
    if (detailedAnalysis && userProfile) {
      detailedAnalysisText = await generateDetailedAnalysis(job, userProfile, {
        matchingSkills,
        missingSkills,
        score: matchScore,
      });
    }

    return {
      matchScore,
      matchingSkills,
      missingSkills: includeMissingSkills ? missingSkills : [],
      suggestions: includeSuggestions ? suggestions : [],
      scoreBreakdown: detailedAnalysis ? scoreBreakdown : undefined,
      detailedAnalysis: detailedAnalysis ? detailedAnalysisText : undefined,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    logger.error('Error analyzing job listing:', error);
    throw new Error('Failed to analyze job listing');
  }
}

/**
 * Extracts skills from job description using LLM API
 */
export async function extractSkillsFromJobDescription(description: string): Promise<string[]> {
  try {
    // First, try to extract skills using regex
    const skillsRegex = /\b(?:JavaScript|TypeScript|React|Node\.?js|Python|Java|AWS|Docker|Kubernetes|SQL|NoSQL|Git|CI\/CD|REST|GraphQL|gRPC|microservices|TDD|Agile|Scrum|DevOps|SRE|ML|AI|TensorFlow|PyTorch|Data Science|Big Data|Spark|Kafka|Redis|MongoDB|PostgreSQL|MySQL|DynamoDB|Cassandra|Elasticsearch|Kibana|Grafana|Prometheus|AWS|GCP|Azure|Terraform|Ansible|Docker|Kubernetes|Helm|ArgoCD|Jenkins|GitHub Actions|CircleCI|GitLab CI)\b/gi;
    const regexMatches = Array.from(new Set((description.match(skillsRegex) || []).map(s => s.trim().toLowerCase())));
    
    try {
      const systemPrompt = `You are an AI assistant that extracts technical skills from job descriptions. 
      Return a JSON array of unique skill names in lowercase, without any additional text or formatting.`;
      
      const response = await llmRequest(
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Extract skills from this job description:\n\n${description}` }
        ],
        'llama3'
      );
      
      // Parse the response and combine with regex matches
      let aiSkills: string[] = [];
      try {
        // Try to parse as JSON array
        aiSkills = JSON.parse(response);
      } catch (e) {
        // If JSON parsing fails, try to extract array from text
        const match = response.match(/\[.*\]/s);
        if (match) {
          aiSkills = JSON.parse(match[0]);
        } else {
          // Last resort: split by comma and clean up
          aiSkills = response
            .split(',')
            .map((s: string) => s.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, ''))
            .filter(Boolean);
        }
      }
      
      // Combine with regex matches and ensure uniqueness
      const allSkills = [...new Set([...aiSkills, ...regexMatches])];
      return allSkills.filter(Boolean);
    } catch (aiError) {
      logger.error('Error extracting skills with AI, falling back to regex:', aiError);
      return regexMatches;
    }
  } catch (error) {
    logger.error('Error extracting skills:', error);
    return [];
  }
}

/**
 * Calculates how well the user's experience matches the job requirements
 */
function calculateExperienceMatch(
  job: JobListing,
  userProfile: any,
  _options: { includeMissingSkills?: boolean } = {}
): number {
  // This is a simplified implementation
  // In a real app, we would analyze the job requirements against the user's experience
  const jobTitle = job.title.toLowerCase();
  // Use the job description if it exists
  const jobDescription = job.description ? job.description.toLowerCase() : '';
  
  // Check if user has relevant experience
  const hasRelevantExperience = userProfile?.experience?.some((exp: any) => {
    const expTitle = exp.title.toLowerCase();
    const expDescription = exp.description?.toLowerCase() || '';
    
    // Check if the experience title or description contains relevant keywords
    const titleMatch = expTitle.includes(jobTitle) || jobTitle.includes(expTitle);
    const descriptionMatch = jobDescription && expDescription.includes(jobDescription);
    
    return titleMatch || descriptionMatch;
  }) || false;
  
  return hasRelevantExperience ? 1 : 0.3; // 100% match or 30% if no direct experience
}

/**
 * Calculates how well the user's education matches the job requirements
 */
function calculateEducationMatch(
  _job: JobListing,
  userProfile: any
): number {
  // This is a simplified implementation
  // In a real app, we would analyze the education requirements
  const hasHigherEducation = userProfile?.education?.length > 0;
  
  // Return a score based on education level
  return hasHigherEducation ? 1 : 0;
}

/**
 * Generates suggestions for improving the resume based on the job requirements
 */
export async function generateSuggestions(
  job: JobListing,
  matchingSkills: string[],
  missingSkills: string[]
): Promise<string[]> {
  try {
    const response = await llmRequest(
      [
        {
          role: 'system',
          content: `You are a career advisor. Generate 3-5 specific suggestions for the user to improve their resume for the given job.`,
        },
        {
          role: 'user',
          content: `Job Title: ${job.title}\n\nJob Description: ${job.description}\n\nMatching Skills: ${matchingSkills.join(', ')}\nMissing Skills: ${missingSkills.join(', ')}`,
        },
      ],
      'llama3'
    );

    // Parse the response into an array of suggestions
    return response
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.match(/^\d+\./)) // Only keep lines that start with a number
      .map((s) => s.replace(/^\d+\.\s*/, '')) // Remove the number prefix
      .filter(Boolean); // Remove empty strings
  } catch (error) {
    logger.error('Error generating suggestions:', error);
    return [
      'Highlight your relevant experience in your resume summary.',
      'Include specific achievements with metrics when possible.',
      'Tailor your skills section to match the job requirements.',
    ];
  }
}

/**
 * Generates a detailed analysis of the job match
 */
async function generateDetailedAnalysis(
  job: JobListing,
  _userProfile: any, // Keep for backward compatibility
  analysis: {
    matchingSkills: string[];
    missingSkills: string[];
    score: number;
  }
): Promise<string> {
  try {
    const response = await llmRequest(
      [
        {
          role: 'system',
          content: `You are a career advisor. Provide a detailed analysis of how well the user's profile matches the job requirements.`,
        },
        {
          role: 'user',
          content: `Job Title: ${job.title}\n\nJob Description: ${job.description}\n\nMatching Skills: ${analysis.matchingSkills.join(
            ', '
          )}\nMissing Skills: ${analysis.missingSkills.join(
            ', '
          )}\n\nAnalysis Score: ${analysis.score}/100`,
        },
      ],
      'llama3'
    );

    return response;
  } catch (error) {
    logger.error('Error generating detailed analysis:', error);
    return `Based on our analysis, your profile has a ${analysis.score}% match with this job.`;
  }
}
