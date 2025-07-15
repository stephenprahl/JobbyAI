const { Elysia, t } = require('elysia');
import { authService } from '../services/auth.service';
import { logger } from '../utils/logger';

interface SalaryAnalysisRequest {
  position: string;
  location: string;
  experience: number;
  skills: string[];
  industry: string;
  companySize: 'startup' | 'medium' | 'large' | 'enterprise';
  targetSalary: number;
}

interface MarketDataResponse {
  percentile25: number;
  percentile50: number;
  percentile75: number;
  percentile90: number;
  averageSalary: number;
  location: string;
  sampleSize: number;
  lastUpdated: string;
  source: string;
}

interface NegotiationTip {
  id: string;
  category: 'preparation' | 'strategy' | 'communication' | 'alternatives';
  title: string;
  description: string;
  importance: 'high' | 'medium' | 'low';
  actionItems: string[];
  personalizedNote?: string;
}

interface CompensationAnalysis {
  baseSalary: number;
  estimatedBonus: number;
  equityValue: number;
  benefitsValue: {
    healthcare: number;
    retirement: number;
    vacation: number;
    other: number;
  };
  totalCompensation: number;
  marketComparison: {
    percentile: number;
    isCompetitive: boolean;
    gap: number;
  };
}

export const salaryNegotiationRoutes = new Elysia({ prefix: '/api/salary-negotiation' })
  .use(authService)
  .get('/market-data', async ({ query, user, set }) => {
    try {
      if (!user) {
        set.status = 401;
        return { error: 'Unauthorized' };
      }

      const { position, location, experience, industry } = query;

      logger.info('Fetching market data', {
        userId: user.id,
        position,
        location,
        experience: parseInt(experience as string),
        industry
      });

      // In a real implementation, this would call external APIs like:
      // - Glassdoor API
      // - Salary.com API
      // - PayScale API
      // - LinkedIn Salary Insights
      // - Bureau of Labor Statistics

      // Mock sophisticated market data based on position and location
      const baseData = await generateMarketData(position, location, parseInt(experience as string), industry);

      return {
        success: true,
        data: baseData
      };
    } catch (error) {
      logger.error('Error fetching market data:', error);
      set.status = 500;
      return { error: 'Failed to fetch market data' };
    }
  }, {
    query: t.Object({
      position: t.String(),
      location: t.String(),
      experience: t.String(),
      industry: t.String()
    })
  })

  .post('/analyze-compensation', async ({ body, user, set }) => {
    try {
      if (!user) {
        set.status = 401;
        return { error: 'Unauthorized' };
      }

      logger.info('Analyzing compensation package', { userId: user.id, request: body });

      const analysis = await analyzeCompensationPackage(body);

      // Store the analysis in user's history
      await storeCompensationAnalysis(user.id, body, analysis);

      return {
        success: true,
        data: analysis
      };
    } catch (error) {
      logger.error('Error analyzing compensation:', error);
      set.status = 500;
      return { error: 'Failed to analyze compensation' };
    }
  }, {
    body: t.Object({
      position: t.String(),
      location: t.String(),
      experience: t.Number(),
      skills: t.Array(t.String()),
      industry: t.String(),
      companySize: t.Union([
        t.Literal('startup'),
        t.Literal('medium'),
        t.Literal('large'),
        t.Literal('enterprise')
      ]),
      targetSalary: t.Number(),
      currentSalary: t.Optional(t.Number()),
      hasOtherOffers: t.Optional(t.Boolean()),
      yearsAtCompany: t.Optional(t.Number())
    })
  })

  .get('/negotiation-tips', async ({ query, user, set }) => {
    try {
      if (!user) {
        set.status = 401;
        return { error: 'Unauthorized' };
      }

      const { position, experience, targetSalary, hasOffers } = query;

      logger.info('Generating negotiation tips', {
        userId: user.id,
        position,
        experience: parseInt(experience as string),
        targetSalary: parseInt(targetSalary as string),
        hasOffers: hasOffers === 'true'
      });

      const tips = await generatePersonalizedTips({
        position,
        experience: parseInt(experience as string),
        targetSalary: parseInt(targetSalary as string),
        hasOtherOffers: hasOffers === 'true',
        user
      });

      return {
        success: true,
        data: tips
      };
    } catch (error) {
      logger.error('Error generating negotiation tips:', error);
      set.status = 500;
      return { error: 'Failed to generate tips' };
    }
  }, {
    query: t.Object({
      position: t.String(),
      experience: t.String(),
      targetSalary: t.String(),
      hasOffers: t.Optional(t.String())
    })
  })

  .post('/generate-script', async ({ body, user, set }) => {
    try {
      if (!user) {
        set.status = 401;
        return { error: 'Unauthorized' };
      }

      logger.info('Generating negotiation script', { userId: user.id, scenario: body.scenario });

      const script = await generateNegotiationScript(body);

      return {
        success: true,
        data: script
      };
    } catch (error) {
      logger.error('Error generating script:', error);
      set.status = 500;
      return { error: 'Failed to generate script' };
    }
  }, {
    body: t.Object({
      scenario: t.Union([
        t.Literal('initial_offer'),
        t.Literal('counteroffer'),
        t.Literal('promotion_request'),
        t.Literal('raise_request'),
        t.Literal('competing_offer')
      ]),
      position: t.String(),
      targetSalary: t.Number(),
      currentSalary: t.Optional(t.Number()),
      strengths: t.Array(t.String()),
      achievements: t.Array(t.String())
    })
  })

  .get('/salary-history', async ({ user, set }) => {
    try {
      if (!user) {
        set.status = 401;
        return { error: 'Unauthorized' };
      }

      // Get user's salary analysis history
      const history = await getSalaryAnalysisHistory(user.id);

      return {
        success: true,
        data: history
      };
    } catch (error) {
      logger.error('Error fetching salary history:', error);
      set.status = 500;
      return { error: 'Failed to fetch history' };
    }
  })

  .post('/save-negotiation-outcome', async ({ body, user, set }) => {
    try {
      if (!user) {
        set.status = 401;
        return { error: 'Unauthorized' };
      }

      logger.info('Saving negotiation outcome', { userId: user.id, outcome: body });

      await saveNegotiationOutcome(user.id, body);

      return {
        success: true,
        message: 'Outcome saved successfully'
      };
    } catch (error) {
      logger.error('Error saving negotiation outcome:', error);
      set.status = 500;
      return { error: 'Failed to save outcome' };
    }
  }, {
    body: t.Object({
      position: t.String(),
      initialOffer: t.Number(),
      finalOffer: t.Number(),
      negotiationStrategy: t.String(),
      outcome: t.Union([
        t.Literal('accepted'),
        t.Literal('rejected'),
        t.Literal('countered'),
        t.Literal('pending')
      ]),
      notes: t.Optional(t.String()),
      lessons: t.Optional(t.Array(t.String()))
    })
  });

// Helper Functions

async function generateMarketData(
  position: string,
  location: string,
  experience: number,
  industry: string
): Promise<MarketDataResponse> {
  // Mock market data generation based on real salary trends
  const baseSalaries: Record<string, number> = {
    'software engineer': 95000,
    'senior software engineer': 140000,
    'product manager': 120000,
    'data scientist': 115000,
    'designer': 85000,
    'marketing manager': 90000,
    'sales manager': 95000,
    'engineering manager': 160000,
    'default': 80000
  };

  const locationMultipliers: Record<string, number> = {
    'san francisco': 1.6,
    'new york': 1.4,
    'seattle': 1.3,
    'boston': 1.25,
    'los angeles': 1.2,
    'chicago': 1.1,
    'austin': 1.05,
    'denver': 1.0,
    'atlanta': 0.95,
    'default': 0.9
  };

  const industryMultipliers: Record<string, number> = {
    'technology': 1.2,
    'finance': 1.15,
    'consulting': 1.1,
    'healthcare': 1.05,
    'education': 0.8,
    'non-profit': 0.75,
    'default': 1.0
  };

  const positionKey = position.toLowerCase();
  const locationKey = location.toLowerCase().split(',')[0];
  const industryKey = industry.toLowerCase();

  const baseSalary = baseSalaries[positionKey] || baseSalaries['default'];
  const locationMultiplier = locationMultipliers[locationKey] || locationMultipliers['default'];
  const industryMultiplier = industryMultipliers[industryKey] || industryMultipliers['default'];
  const experienceMultiplier = 1 + (experience * 0.08); // 8% per year of experience

  const adjustedBase = baseSalary * locationMultiplier * industryMultiplier * experienceMultiplier;

  return {
    percentile25: Math.round(adjustedBase * 0.8),
    percentile50: Math.round(adjustedBase),
    percentile75: Math.round(adjustedBase * 1.25),
    percentile90: Math.round(adjustedBase * 1.5),
    averageSalary: Math.round(adjustedBase * 1.1),
    location,
    sampleSize: Math.floor(Math.random() * 2000) + 500,
    lastUpdated: new Date().toISOString().split('T')[0],
    source: 'Aggregated from multiple sources'
  };
}

async function analyzeCompensationPackage(request: SalaryAnalysisRequest): Promise<CompensationAnalysis> {
  const marketData = await generateMarketData(
    request.position,
    request.location,
    request.experience,
    request.industry
  );

  // Calculate total compensation components
  const estimatedBonus = Math.round(request.targetSalary * 0.15); // 15% bonus estimate
  const equityValue = request.companySize === 'startup' ? Math.round(request.targetSalary * 0.3) :
    request.companySize === 'medium' ? Math.round(request.targetSalary * 0.2) :
      Math.round(request.targetSalary * 0.1);

  const benefitsValue = {
    healthcare: Math.round(request.targetSalary * 0.08),
    retirement: Math.round(request.targetSalary * 0.06),
    vacation: Math.round(request.targetSalary * 0.04),
    other: Math.round(request.targetSalary * 0.03)
  };

  const totalBenefits = Object.values(benefitsValue).reduce((sum, val) => sum + val, 0);
  const totalCompensation = request.targetSalary + estimatedBonus + equityValue + totalBenefits;

  // Calculate market comparison
  const marketPercentile = calculatePercentile(request.targetSalary, marketData);
  const isCompetitive = marketPercentile >= 50;
  const gap = request.targetSalary - marketData.percentile50;

  return {
    baseSalary: request.targetSalary,
    estimatedBonus,
    equityValue,
    benefitsValue,
    totalCompensation,
    marketComparison: {
      percentile: marketPercentile,
      isCompetitive,
      gap
    }
  };
}

function calculatePercentile(salary: number, marketData: MarketDataResponse): number {
  if (salary <= marketData.percentile25) return 25;
  if (salary <= marketData.percentile50) return 50;
  if (salary <= marketData.percentile75) return 75;
  if (salary <= marketData.percentile90) return 90;
  return 95;
}

async function generatePersonalizedTips(params: {
  position: string;
  experience: number;
  targetSalary: number;
  hasOtherOffers: boolean;
  user: any;
}): Promise<NegotiationTip[]> {
  const baseTips: NegotiationTip[] = [
    {
      id: '1',
      category: 'preparation',
      title: 'Research Market Rates',
      description: 'Gather comprehensive salary data for your role, experience level, and location',
      importance: 'high',
      actionItems: [
        'Use multiple salary comparison sites (Glassdoor, PayScale, Salary.com)',
        'Network with professionals in similar roles',
        'Consider total compensation, not just base salary',
        'Factor in cost of living differences by location'
      ]
    },
    {
      id: '2',
      category: 'strategy',
      title: 'Document Your Value Proposition',
      description: 'Create a comprehensive case for why you deserve the target salary',
      importance: 'high',
      actionItems: [
        'List specific achievements with quantifiable impact',
        'Highlight unique skills that differentiate you',
        'Document cost savings or revenue you\'ve generated',
        'Include any certifications or additional training'
      ]
    },
    {
      id: '3',
      category: 'communication',
      title: 'Master the Conversation Flow',
      description: 'Practice key phrases and responses for different negotiation scenarios',
      importance: 'medium',
      actionItems: [
        'Practice your opening statement with a trusted friend',
        'Prepare responses to common objections',
        'Focus on mutual benefit, not personal needs',
        'Maintain a collaborative tone throughout'
      ]
    },
    {
      id: '4',
      category: 'alternatives',
      title: 'Know Your Walk-Away Point',
      description: 'Establish clear boundaries and alternative options',
      importance: 'high',
      actionItems: [
        'Determine your minimum acceptable offer',
        'Consider non-salary benefits as alternatives',
        'Explore timeline for future reviews',
        'Have backup options ready'
      ]
    }
  ];

  // Personalize tips based on user context
  if (params.hasOtherOffers) {
    baseTips.push({
      id: '5',
      category: 'strategy',
      title: 'Leverage Multiple Offers',
      description: 'Use competing offers strategically without appearing threatening',
      importance: 'high',
      actionItems: [
        'Present offers as validation of market value',
        'Focus on why you prefer this company',
        'Be honest about timeline pressures',
        'Use offers to negotiate beyond just salary'
      ],
      personalizedNote: 'Since you have other offers, you\'re in a strong negotiating position!'
    });
  }

  if (params.experience < 2) {
    baseTips[1].personalizedNote = 'As someone early in your career, focus on growth opportunities and learning potential alongside salary.';
    baseTips[1].actionItems.push('Emphasize your potential and eagerness to learn');
  } else if (params.experience > 5) {
    baseTips[1].personalizedNote = 'With your experience level, you can command premium compensation. Don\'t undersell yourself.';
    baseTips[1].actionItems.push('Highlight leadership experience and mentoring capabilities');
  }

  return baseTips;
}

async function generateNegotiationScript(params: {
  scenario: string;
  position: string;
  targetSalary: number;
  currentSalary?: number;
  strengths: string[];
  achievements: string[];
}) {
  const scripts = {
    initial_offer: {
      scenario: 'Responding to Initial Offer',
      opener: `Thank you for the offer for the ${params.position} position. I'm very excited about the opportunity to contribute to the team. I've done some research on market rates for this role, and I was hoping we could discuss the compensation package.`,
      keyPoints: [
        'Express genuine enthusiasm for the role',
        'Reference your market research',
        'Highlight your unique qualifications',
        'Focus on the value you\'ll bring to the company'
      ],
      responses: [
        {
          objection: "This is our standard rate for this level",
          response: "I understand that's your typical range. Given my specific experience with [relevant skills], I believe I can contribute above the standard level. Could we explore a compensation package that reflects this additional value?"
        },
        {
          objection: "The budget is fixed for this position",
          response: "I appreciate the budget constraints. Perhaps we could explore other forms of compensation such as additional vacation time, professional development budget, or equity that might work within the current framework?"
        }
      ],
      closingStatement: `I'm committed to contributing to the team's success and I believe my skills in ${params.strengths.slice(0, 2).join(' and ')} will add significant value. Is there flexibility in the package that would allow us to reach a mutually beneficial agreement?`
    },
    // Add more scenarios as needed
  };

  return scripts[params.scenario as keyof typeof scripts] || scripts.initial_offer;
}

async function storeCompensationAnalysis(userId: string, request: SalaryAnalysisRequest, analysis: CompensationAnalysis) {
  // In a real implementation, store in database
  logger.info('Storing compensation analysis', { userId, analysis });
}

async function getSalaryAnalysisHistory(userId: string) {
  // In a real implementation, fetch from database
  return [];
}

async function saveNegotiationOutcome(userId: string, outcome: any) {
  // In a real implementation, store in database
  logger.info('Saving negotiation outcome', { userId, outcome });
}
