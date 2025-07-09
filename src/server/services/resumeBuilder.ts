import { UserProfile } from '../schemas/analysis';
import { JobListing } from '../schemas/analysis';
import { logger } from '../utils/logger';
import { chatCompletion } from './ollama';

/**
 * Makes a request to the LLM API
 */
async function llmRequest(
  messages: Array<{ role: string; content: string }>,
  model: string = 'llama3',
  temperature: number = 0.7,
  maxTokens: number = 2000
): Promise<string> {
  try {
    return await chatCompletion(messages, {
      model,
      temperature,
      maxTokens,
    });
  } catch (error) {
    logger.error('LLM API request failed:', error);
    throw error;
  }
}

interface ResumeBuilderOptions {
  format?: 'markdown' | 'html' | 'text' | 'pdf';
  includeSummary?: boolean;
  includeSkills?: boolean;
  includeExperience?: boolean;
  includeEducation?: boolean;
  includeCertifications?: boolean;
  maxLength?: number;
}

const DEFAULT_OPTIONS: ResumeBuilderOptions = {
  format: 'markdown',
  includeSummary: true,
  includeSkills: true,
  includeExperience: true,
  includeEducation: true,
  includeCertifications: true,
  maxLength: 1000,
};

/**
 * Generates a tailored resume based on user profile and job listing
 */
export async function generateResume(
  userProfile: UserProfile,
  jobListing: JobListing,
  options: ResumeBuilderOptions = {}
): Promise<string> {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  const { format } = mergedOptions;

  try {
    logger.info('Generating resume', {
      jobTitle: jobListing.title,
      company: jobListing.company,
      format,
    });

    // Prepare the prompt for the AI
    const prompt = createResumePrompt(userProfile, jobListing, mergedOptions);

    // Call the LLM API
    const resumeContent = await llmRequest(
      [
        {
          role: 'system',
          content: 'You are a professional resume writer. Create a tailored resume based on the user profile and job listing.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      'llama3',
      0.7,
      2000
    ) || '';

    if (!resumeContent) {
      throw new Error('Failed to generate resume content');
    }

    logger.info('Successfully generated resume', {
      jobTitle: jobListing.title,
      company: jobListing.company,
      length: resumeContent.length,
    });

    return formatResume(resumeContent, format);
  } catch (error) {
    logger.error('Error generating resume:', error);
    throw new Error('Failed to generate resume');
  }
}

/**
 * Creates a prompt for the AI to generate a tailored resume
 */
function createResumePrompt(
  userProfile: UserProfile,
  jobListing: JobListing,
  options: ResumeBuilderOptions
): string {
  const {
    includeSummary = true,
    includeSkills = true,
    includeExperience = true,
    includeEducation = true,
    includeCertifications = true,
    maxLength = 1000,
  } = options;

  const sections: string[] = [];

  if (includeSummary) {
    sections.push(`Professional Summary: Highlight the candidate's most relevant qualifications for the ${jobListing.title} position at ${jobListing.company}.`);
  }

  if (includeSkills && userProfile.skills?.length) {
    sections.push(`Skills: List the most relevant skills from the candidate's profile that match the job requirements.`);
  }

  if (includeExperience && userProfile.experience?.length) {
    sections.push(`Work Experience: For each position, emphasize responsibilities and achievements that are most relevant to the job. Use action verbs and quantify results when possible.`);
  }

  if (includeEducation && userProfile.education?.length) {
    sections.push(`Education: Include degrees, institutions, and any relevant coursework or projects.`);
  }

  if (includeCertifications && userProfile.certifications?.length) {
    sections.push(`Certifications: List relevant certifications.`);
  }

  return `
    Create a professional resume tailored for the ${jobListing.title} position at ${jobListing.company}.

    Job Description:
    ${jobListing.description}
    ${jobListing.requirements ? `\nRequirements:\n${jobListing.requirements.join('\n')}` : ''}

    Candidate Information:
    ${JSON.stringify(userProfile, null, 2)}

    Instructions:
    1. Focus on the candidate's most relevant qualifications for this specific role
    2. Use industry-standard resume formatting
    3. Keep it concise and targeted (max ${maxLength} words)
    4. Include these sections: ${sections.join(', ')}
    5. Use bullet points for better readability
    6. Quantify achievements where possible
    7. Use action verbs
    8. Match the resume language to the job description keywords
  `;
}

/**
 * Formats the generated resume content based on the specified format
 */
function formatResume(content: string, format: string = 'markdown'): string {
  switch (format.toLowerCase()) {
    case 'html':
      return convertMarkdownToHtml(content);
    case 'pdf':
      // In a real implementation, you would use a PDF generation library here
      return content;
    case 'text':
      return content.replace(/^#+\s*/gm, '') // Remove markdown headers
                   .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
                   .replace(/\*(.*?)\*/g, '$1') // Remove italics
                   .replace(/\n\s*\n/g, '\n\n'); // Normalize newlines
    case 'markdown':
    default:
      return content;
  }
}

/**
 * Converts markdown to HTML (simplified example)
 */
function convertMarkdownToHtml(markdown: string): string {
  // This is a simplified example - in a real app, use a library like marked or remark
  return markdown
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>')
    .replace(/\n\s*\n/g, '</p><p>')
    .replace(/^<p>(.*?)<\/p>$/s, '<!DOCTYPE html><html><head><title>Resume</title></head><body><div class="resume">$1</div></body></html>');
}

// Export types
export type { ResumeBuilderOptions };
