import { logger } from '../utils/logger';

// Job site APIs and configurations
const JOB_APIS = {
  ADZUNA: {
    BASE_URL: 'https://api.adzuna.com/v1/api/jobs',
    APP_ID: process.env.ADZUNA_APP_ID || '',
    APP_KEY: process.env.ADZUNA_APP_KEY || ''
  },
  INDEED: {
    BASE_URL: 'https://api.indeed.com/ads/apisearch',
    PUBLISHER_ID: process.env.INDEED_PUBLISHER_ID || ''
  },
  JOOBLE: {
    BASE_URL: 'https://jooble.org/api',
    API_KEY: process.env.JOOBLE_API_KEY || ''
  },
  GITHUB_JOBS: {
    BASE_URL: 'https://jobs.github.com/positions.json'
  },
  REMOTIVE: {
    BASE_URL: 'https://remotive.io/api/remote-jobs'
  }
};

export interface JobSearchFilters {
  query?: string;
  location?: string;
  jobType?: 'full-time' | 'part-time' | 'contract' | 'temporary' | 'internship';
  remote?: boolean;
  salaryMin?: number;
  salaryMax?: number;
  experience?: 'entry' | 'mid' | 'senior';
  industry?: string;
  postedDays?: number;
  limit?: number;
  offset?: number;
}

export interface ExternalJobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  skills: string[];
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  jobType: string;
  remote: boolean;
  postedDate: string;
  url: string;
  source: 'adzuna' | 'indeed' | 'jooble' | 'linkedin' | 'glassdoor' | 'github' | 'remotive';
  logo?: string;
  applyUrl?: string;
}

export interface JobSearchResponse {
  jobs: ExternalJobListing[];
  totalCount: number;
  hasMore: boolean;
  nextOffset?: number;
}

/**
 * Search for jobs using Adzuna API
 */
async function searchAdzunaJobs(filters: JobSearchFilters): Promise<ExternalJobListing[]> {
  try {
    const { APP_ID, APP_KEY, BASE_URL } = JOB_APIS.ADZUNA;

    if (!APP_ID || !APP_KEY) {
      logger.warn('Adzuna API credentials not configured');
      return [];
    }

    const params = new URLSearchParams({
      app_id: APP_ID,
      app_key: APP_KEY,
      results_per_page: (filters.limit || 20).toString(),
      page: Math.floor((filters.offset || 0) / (filters.limit || 20)).toString(),
      sort_by: 'date',
      content_type: 'application/json'
    });

    if (filters.query) {
      params.append('what', filters.query);
    }

    if (filters.location) {
      params.append('where', filters.location);
    }

    if (filters.salaryMin) {
      params.append('salary_min', filters.salaryMin.toString());
    }

    if (filters.salaryMax) {
      params.append('salary_max', filters.salaryMax.toString());
    }

    const country = 'us'; // Default to US, could be configurable
    const url = `${BASE_URL}/${country}/search/1?${params.toString()}`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'JobbyAI/1.0',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Adzuna API error: ${response.status}`);
    }

    const data = await response.json();

    return data.results?.map((job: any) => ({
      id: job.id || `adzuna-${Math.random().toString(36).substr(2, 9)}`,
      title: job.title || 'Untitled Position',
      company: job.company?.display_name || 'Unknown Company',
      location: job.location?.display_name || 'Location not specified',
      description: job.description || 'No description available',
      requirements: extractRequirements(job.description || ''),
      skills: extractSkills(job.description || ''),
      salary: job.salary_min || job.salary_max ? {
        min: job.salary_min,
        max: job.salary_max,
        currency: 'USD'
      } : undefined,
      jobType: job.contract_time || 'full_time',
      remote: (job.description || '').toLowerCase().includes('remote'),
      postedDate: job.created || new Date().toISOString(),
      url: job.redirect_url || '',
      source: 'adzuna' as const,
      logo: job.company?.logo_url,
      applyUrl: job.redirect_url
    })) || [];

  } catch (error) {
    logger.error('Error fetching Adzuna jobs:', error);
    return [];
  }
}

/**
 * Search for jobs using Jooble API
 */
async function searchJoobleJobs(filters: JobSearchFilters): Promise<ExternalJobListing[]> {
  try {
    const { API_KEY, BASE_URL } = JOB_APIS.JOOBLE;

    if (!API_KEY) {
      logger.warn('Jooble API key not configured');
      return [];
    }

    const payload = {
      keywords: filters.query || '',
      location: filters.location || '',
      radius: '25',
      page: Math.floor((filters.offset || 0) / (filters.limit || 20)) + 1,
      ...(filters.salaryMin && { salarymin: filters.salaryMin }),
      ...(filters.salaryMax && { salarymax: filters.salaryMax }),
      ...(filters.postedDays && { datecreatedfrom: filters.postedDays })
    };

    const response = await fetch(`${BASE_URL}/${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'JobbyAI/1.0'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Jooble API error: ${response.status}`);
    }

    const data = await response.json();

    return data.jobs?.map((job: any) => ({
      id: `jooble-${Math.random().toString(36).substr(2, 9)}`,
      title: job.title || 'Untitled Position',
      company: job.company || 'Unknown Company',
      location: job.location || 'Location not specified',
      description: job.snippet || 'No description available',
      requirements: extractRequirements(job.snippet || ''),
      skills: extractSkills(job.snippet || ''),
      salary: job.salary ? {
        min: parseInt(job.salary.replace(/[^0-9]/g, '')),
        currency: 'USD'
      } : undefined,
      jobType: job.type || 'full_time',
      remote: (job.snippet || '').toLowerCase().includes('remote'),
      postedDate: job.updated || new Date().toISOString(),
      url: job.link || '',
      source: 'jooble' as const,
      applyUrl: job.link
    })) || [];

  } catch (error) {
    logger.error('Error fetching Jooble jobs:', error);
    return [];
  }
}

/**
 * Search for remote jobs using Remotive API
 */
async function searchRemotiveJobs(filters: JobSearchFilters): Promise<ExternalJobListing[]> {
  try {
    if (!filters.remote && !filters.query?.toLowerCase().includes('remote')) {
      return []; // Only search Remotive if remote jobs are requested
    }

    const params = new URLSearchParams();
    if (filters.query) {
      params.append('search', filters.query);
    }
    params.append('limit', (filters.limit || 20).toString());

    const response = await fetch(`${JOB_APIS.REMOTIVE.BASE_URL}?${params.toString()}`, {
      headers: {
        'User-Agent': 'JobbyAI/1.0'
      }
    });

    if (!response.ok) {
      logger.warn(`Remotive API error: ${response.status}`);
      return [];
    }

    const data = await response.json();

    return data.jobs?.map((job: any) => ({
      id: `remotive-${job.id}`,
      title: job.title || 'Untitled Position',
      company: job.company_name || 'Unknown Company',
      location: 'Remote',
      description: job.description || 'No description available',
      requirements: extractRequirements(job.description || ''),
      skills: job.tags || [],
      salary: job.salary ? {
        min: parseInt(job.salary.replace(/[^0-9]/g, '')) || undefined,
        currency: 'USD'
      } : undefined,
      jobType: job.job_type || 'full_time',
      remote: true,
      postedDate: job.publication_date || new Date().toISOString(),
      url: job.url || '',
      source: 'remotive' as const,
      applyUrl: job.url
    })).slice(0, filters.limit || 20) || [];

  } catch (error) {
    logger.error('Error fetching Remotive jobs:', error);
    return [];
  }
}

/**
 * Search for GitHub Jobs (Note: GitHub Jobs API was deprecated, but keeping for mock data)
 */
async function searchGitHubJobs(filters: JobSearchFilters): Promise<ExternalJobListing[]> {
  try {
    // Since GitHub Jobs API was deprecated, we'll return empty array
    // but keep the structure for potential future alternatives
    return [];
  } catch (error) {
    logger.error('Error fetching GitHub jobs:', error);
    return [];
  }
}

/**
 * Generate mock job listings for development/fallback
 */
function generateMockJobs(filters: JobSearchFilters): ExternalJobListing[] {
  const companies = [
    'Google', 'Microsoft', 'Amazon', 'Apple', 'Meta', 'Netflix', 'Tesla', 'OpenAI',
    'Stripe', 'Airbnb', 'Uber', 'Spotify', 'Shopify', 'Figma', 'Notion', 'GitHub'
  ];

  const titles = [
    'Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
    'DevOps Engineer', 'Data Scientist', 'Product Manager', 'UX Designer', 'UI Designer',
    'Machine Learning Engineer', 'Cloud Architect', 'Senior Developer', 'Principal Engineer'
  ];

  const locations = [
    'San Francisco, CA', 'New York, NY', 'Seattle, WA', 'Austin, TX', 'Boston, MA',
    'Los Angeles, CA', 'Chicago, IL', 'Denver, CO', 'Remote', 'Portland, OR'
  ];

  const jobTypes = ['full_time', 'part_time', 'contract'];
  const sources = ['linkedin', 'glassdoor', 'indeed', 'github', 'remotive'] as const;

  const mockJobs: ExternalJobListing[] = [];
  const count = filters.limit || 20;

  for (let i = 0; i < count; i++) {
    const company = companies[Math.floor(Math.random() * companies.length)];
    const title = titles[Math.floor(Math.random() * titles.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const isRemote = location === 'Remote' || Math.random() > 0.7;

    mockJobs.push({
      id: `mock-${i + 1}`,
      title,
      company,
      location,
      description: `We are looking for a talented ${title} to join our ${company} team. This is an excellent opportunity to work on cutting-edge technology and make a real impact.`,
      requirements: [
        '3+ years of relevant experience',
        'Strong programming skills',
        'Team collaboration',
        'Problem-solving abilities'
      ],
      skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS'],
      salary: {
        min: 80000 + Math.floor(Math.random() * 100000),
        max: 120000 + Math.floor(Math.random() * 150000),
        currency: 'USD'
      },
      jobType: jobTypes[Math.floor(Math.random() * jobTypes.length)],
      remote: isRemote,
      postedDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      url: `https://jobs.${company.toLowerCase()}.com/job/${i + 1}`,
      source: sources[Math.floor(Math.random() * sources.length)],
      applyUrl: `https://jobs.${company.toLowerCase()}.com/apply/${i + 1}`
    });
  }

  return mockJobs;
}

/**
 * Main job search function that aggregates results from multiple sources
 */
export async function searchJobs(filters: JobSearchFilters): Promise<JobSearchResponse> {
  try {
    logger.info('Searching for jobs with filters:', filters);

    // Run searches in parallel
    const [adzunaJobs, joobleJobs, remotiveJobs] = await Promise.allSettled([
      searchAdzunaJobs(filters),
      searchJoobleJobs(filters),
      searchRemotiveJobs(filters)
    ]);

    let allJobs: ExternalJobListing[] = [];

    // Collect successful results
    if (adzunaJobs.status === 'fulfilled') {
      allJobs.push(...adzunaJobs.value);
    }
    if (joobleJobs.status === 'fulfilled') {
      allJobs.push(...joobleJobs.value);
    }
    if (remotiveJobs.status === 'fulfilled') {
      allJobs.push(...remotiveJobs.value);
    }

    // If no external jobs found, use mock data for development
    if (allJobs.length === 0) {
      logger.info('No external jobs found, using mock data');
      allJobs = generateMockJobs(filters);
    }

    // Apply additional filtering
    if (filters.remote) {
      allJobs = allJobs.filter(job => job.remote);
    }

    if (filters.experience) {
      allJobs = allJobs.filter(job => {
        const desc = job.description.toLowerCase();
        switch (filters.experience) {
          case 'entry':
            return desc.includes('entry') || desc.includes('junior') || desc.includes('0-2 years');
          case 'mid':
            return desc.includes('mid') || desc.includes('3-5 years') || desc.includes('intermediate');
          case 'senior':
            return desc.includes('senior') || desc.includes('5+ years') || desc.includes('lead');
          default:
            return true;
        }
      });
    }

    // Sort by posted date (newest first)
    allJobs.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());

    // Remove duplicates based on title + company
    const uniqueJobs = allJobs.filter((job, index, self) =>
      index === self.findIndex(j =>
        j.title.toLowerCase() === job.title.toLowerCase() &&
        j.company.toLowerCase() === job.company.toLowerCase()
      )
    );

    const limit = filters.limit || 20;
    const offset = filters.offset || 0;
    const paginatedJobs = uniqueJobs.slice(offset, offset + limit);

    return {
      jobs: paginatedJobs,
      totalCount: uniqueJobs.length,
      hasMore: offset + limit < uniqueJobs.length,
      nextOffset: offset + limit < uniqueJobs.length ? offset + limit : undefined
    };

  } catch (error) {
    logger.error('Error in job search:', error);

    // Fallback to mock data
    const mockJobs = generateMockJobs(filters);
    return {
      jobs: mockJobs,
      totalCount: mockJobs.length,
      hasMore: false
    };
  }
}

/**
 * Get trending/popular jobs
 */
export async function getTrendingJobs(limit: number = 10): Promise<ExternalJobListing[]> {
  const trendingFilters: JobSearchFilters = {
    query: 'software engineer',
    limit,
    postedDays: 7
  };

  const results = await searchJobs(trendingFilters);
  return results.jobs;
}

/**
 * Get jobs similar to a given job
 */
export async function getSimilarJobs(job: ExternalJobListing, limit: number = 5): Promise<ExternalJobListing[]> {
  const similarFilters: JobSearchFilters = {
    query: job.title,
    location: job.location,
    limit,
    jobType: job.jobType as any
  };

  const results = await searchJobs(similarFilters);
  return results.jobs.filter(j => j.id !== job.id);
}

// Helper functions
function extractRequirements(description: string): string[] {
  const requirementKeywords = [
    'required', 'requirements', 'must have', 'essential',
    'qualifications', 'skills needed', 'experience with'
  ];

  const sentences = description.split(/[.!?]+/);
  const requirements: string[] = [];

  sentences.forEach(sentence => {
    const lowerSentence = sentence.toLowerCase();
    if (requirementKeywords.some(keyword => lowerSentence.includes(keyword))) {
      requirements.push(sentence.trim());
    }
  });

  return requirements.slice(0, 5); // Limit to 5 requirements
}

function extractSkills(description: string): string[] {
  const commonSkills = [
    'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue', 'Node.js', 'Python',
    'Java', 'C++', 'C#', 'Ruby', 'PHP', 'Go', 'Rust', 'Swift', 'Kotlin',
    'HTML', 'CSS', 'SASS', 'SQL', 'MongoDB', 'PostgreSQL', 'MySQL',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Git', 'Linux',
    'REST', 'GraphQL', 'API', 'Microservices', 'Agile', 'Scrum'
  ];

  const foundSkills = commonSkills.filter(skill =>
    new RegExp(`\\b${skill}\\b`, 'i').test(description)
  );

  return foundSkills.slice(0, 8); // Limit to 8 skills
}
