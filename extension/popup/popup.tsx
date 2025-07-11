import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Badge,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  ChakraProvider,
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Progress,
  SimpleGrid,
  Spinner,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useToast,
  VStack
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  FiBookmark,
  FiBriefcase,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiExternalLink,
  FiFileText,
  FiPlay,
  FiRefreshCw,
  FiSettings,
  FiTarget,
  FiTrendingUp,
  FiUser,
  FiUsers,
  FiXCircle
} from 'react-icons/fi';

// Enhanced Types
type JobApplication = {
  id: string;
  jobTitle: string;
  company: string;
  platform: string;
  appliedDate: string;
  status: 'applied' | 'screening' | 'interview' | 'rejected' | 'offer';
  url: string;
};

type CompanyInsight = {
  name: string;
  size: string;
  industry: string;
  funding: string;
  glassdoorRating: number;
  linkedinConnections: number;
};

type SalaryData = {
  min: number;
  max: number;
  median: number;
  currency: string;
  location: string;
};

type SkillGap = {
  skill: string;
  importance: 'high' | 'medium' | 'low';
  learningResources: string[];
};

type JobAnalysis = {
  matchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  skillGaps: SkillGap[];
  suggestions: string[];
  salaryData?: SalaryData;
  companyInsight?: CompanyInsight;
  interviewQuestions: string[];
};

type UserProfile = {
  name: string;
  currentTitle: string;
  skills: string[];
  experience: number;
  applications: JobApplication[];
};

// Enhanced Popup Component
const Popup: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [analysis, setAnalysis] = useState<JobAnalysis | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [currentJobUrl, setCurrentJobUrl] = useState<string>('');
  const [tabIndex, setTabIndex] = useState(0);
  const toast = useToast();

  useEffect(() => {
    initializeExtension();
  }, []);

  const initializeExtension = async () => {
    try {
      // Get current tab info
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab?.url) {
        setHasError(true);
        setIsLoading(false);
        return;
      }

      setCurrentJobUrl(tab.url);

      // Check if we're on a supported job site
      const isJobSite = isSupportedJobSite(tab.url);

      if (isJobSite) {
        // Load analysis and user data
        await Promise.all([
          loadJobAnalysis(),
          loadUserProfile()
        ]);
      } else {
        // Show general dashboard
        await loadUserProfile();
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Failed to initialize extension:', error);
      setHasError(true);
      setIsLoading(false);
    }
  };

  const isSupportedJobSite = (url: string): boolean => {
    const supportedSites = [
      'linkedin.com/jobs/',
      'indeed.com/viewjob',
      'glassdoor.com/job-listing/',
      'dice.com/jobs/detail/',
      'monster.com/job-openings/',
      'ziprecruiter.com/jobs/',
      'stackoverflow.com/jobs/'
    ];
    return supportedSites.some(site => url.includes(site));
  };

  const loadJobAnalysis = async () => {
    try {
      // Get job data from content script
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const response = await chrome.tabs.sendMessage(tab.id!, {
        type: 'GET_JOB_DATA'
      });

      if (response?.success && response.data) {
        // Send to backend for analysis
        const analysisResponse = await fetch('http://localhost:3002/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            job: {
              title: response.data?.title || 'Unknown Position',
              company: response.data?.company || 'Unknown Company',
              description: response.data?.description || 'No description available',
              requirements: response.data?.requirements || [],
              location: response.data?.location || '',
              salary: response.data?.salary || '',
              skills: response.data?.skills || [],
              experience: response.data?.experience || 0,
              education: response.data?.education || '',
              employmentType: response.data?.employmentType || 'Full-time'
            },
            userProfile: userProfile ? {
              skills: userProfile.skills,
              experience: [{
                title: userProfile.currentTitle,
                company: 'Current Company',
                startDate: '2020-01-01',
                endDate: '2024-01-01',
                description: 'Experience in various technologies',
                skills: userProfile.skills
              }],
              education: [{
                degree: 'Bachelor of Science',
                institution: 'University',
                field: 'Computer Science',
                startDate: '2016-09-01',
                endDate: '2020-05-01'
              }]
            } : undefined,
            options: {
              includeMissingSkills: true,
              includeSuggestions: true,
              detailedAnalysis: true
            }
          })
        });

        if (analysisResponse.ok) {
          const analysisData = await analysisResponse.json();
          setAnalysis(analysisData.data || analysisData);
        } else {
          console.warn('Analysis API failed, no fallback data');
          setAnalysis(null);
        }
      }
    } catch (error) {
      console.error('Failed to load job analysis:', error);
      setAnalysis(null);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserProfile = async () => {
    try {
      // Try to load from backend API first
      const apiResponse = await fetch('http://localhost:3001/api/users/me', {
        headers: {
          'Authorization': `Bearer ${await getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      });

      if (apiResponse.ok) {
        const userData = await apiResponse.json();
        if (userData.success && userData.data) {
          const profile = {
            name: `${userData.data.firstName} ${userData.data.lastName}`,
            currentTitle: userData.data.profile?.headline || 'Professional',
            skills: userData.data.skills?.map((skill: any) => skill.name) || [],
            experience: userData.data.experiences?.length || 0,
            applications: [] // Will be populated from jobListings
          };
          setUserProfile(profile);
          return;
        }
      }

      // Fallback to storage
      const result = await chrome.storage.local.get(['userProfile']);
      if (result.userProfile) {
        setUserProfile(result.userProfile);
      } else {
        console.warn('No user profile available');
        setUserProfile(null);
      }
    } catch (error) {
      console.error('Failed to load user profile:', error);
      setUserProfile(null);
    }
  };

  // Helper function to get auth token
  const getAuthToken = async (): Promise<string> => {
    try {
      const result = await chrome.storage.local.get(['auth_tokens']);
      return result.auth_tokens?.accessToken || '';
    } catch (error) {
      console.error('Error getting auth token:', error);
      return '';
    }
  };

  const saveJobApplication = async () => {
    if (!analysis || !currentJobUrl) return;

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const jobData = await chrome.tabs.sendMessage(tab.id!, {
        type: 'GET_JOB_DATA'
      });

      const application: JobApplication = {
        id: Date.now().toString(),
        jobTitle: jobData.data?.title || 'Unknown Position',
        company: jobData.data?.company || 'Unknown Company',
        platform: getPlatformFromUrl(currentJobUrl),
        appliedDate: new Date().toISOString(),
        status: 'applied',
        url: currentJobUrl
      };

      // Save to local storage and potentially to backend
      const result = await chrome.storage.local.get(['applications']);
      const applications = result.applications || [];
      applications.push(application);
      await chrome.storage.local.set({ applications });

      // Update user profile
      if (userProfile) {
        const updatedProfile = {
          ...userProfile,
          applications: [...userProfile.applications, application]
        };
        setUserProfile(updatedProfile);
        await chrome.storage.local.set({ userProfile: updatedProfile });
      }

      toast({
        title: 'Application Saved!',
        description: 'Job application has been added to your tracker.',
        status: 'success',
        duration: 3000
      });
    } catch (error) {
      console.error('Failed to save application:', error);
      toast({
        title: 'Error',
        description: 'Failed to save application.',
        status: 'error',
        duration: 3000
      });
    }
  };

  const getPlatformFromUrl = (url: string): string => {
    if (url.includes('linkedin.com')) return 'LinkedIn';
    if (url.includes('indeed.com')) return 'Indeed';
    if (url.includes('glassdoor.com')) return 'Glassdoor';
    if (url.includes('dice.com')) return 'Dice';
    if (url.includes('monster.com')) return 'Monster';
    if (url.includes('ziprecruiter.com')) return 'ZipRecruiter';
    return 'Other';
  };

  const openResumeBuilder = () => {
    chrome.tabs.create({ url: 'http://localhost:5173/resume/builder' });
  };

  const openFullDashboard = () => {
    chrome.tabs.create({ url: 'http://localhost:5173/dashboard' });
  };

  if (isLoading) {
    return (
      <ChakraProvider>
        <Box w="400px" h="300px" p={4} display="flex" alignItems="center" justifyContent="center">
          <VStack>
            <Spinner size="lg" color="blue.500" />
            <Text>Loading Resume Plan AI...</Text>
          </VStack>
        </Box>
      </ChakraProvider>
    );
  }

  if (hasError) {
    return (
      <ChakraProvider>
        <Box w="400px" p={4}>
          <Alert status="error">
            <AlertIcon />
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>
              Unable to load extension data.
            </AlertDescription>
          </Alert>
        </Box>
      </ChakraProvider>
    );
  }

  const isJobSite = isSupportedJobSite(currentJobUrl);

  return (
    <ChakraProvider>
      <Box w="450px" maxH="600px" overflowY="auto">
        <Tabs index={tabIndex} onChange={setTabIndex} variant="enclosed" colorScheme="blue">
          <TabList>
            {isJobSite && (
              <Tab>
                <Icon as={FiTarget} mr={2} />
                <Text fontSize="sm">Analysis</Text>
              </Tab>
            )}
            <Tab>
              <Icon as={FiBriefcase} mr={2} />
              <Text fontSize="sm">Applications</Text>
            </Tab>
            <Tab>
              <Icon as={FiUser} mr={2} />
              <Text fontSize="sm">Profile</Text>
            </Tab>
            <Tab>
              <Icon as={FiSettings} mr={2} />
              <Text fontSize="sm">Tools</Text>
            </Tab>
          </TabList>

          <TabPanels>
            {isJobSite && (
              <TabPanel p={4}>
                <JobAnalysisPanel
                  analysis={analysis}
                  onSaveApplication={saveJobApplication}
                  onOpenResumeBuilder={openResumeBuilder}
                />
              </TabPanel>
            )}
            <TabPanel p={4}>
              <ApplicationsPanel applications={userProfile?.applications || []} />
            </TabPanel>
            <TabPanel p={4}>
              <ProfilePanel userProfile={userProfile} />
            </TabPanel>
            <TabPanel p={4}>
              <ToolsPanel onOpenDashboard={openFullDashboard} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </ChakraProvider>
  );
};

// Panel Components
const JobAnalysisPanel: React.FC<{
  analysis: JobAnalysis | null;
  onSaveApplication: () => void;
  onOpenResumeBuilder: () => void;
}> = ({ analysis, onSaveApplication, onOpenResumeBuilder }) => {
  if (!analysis) {
    return (
      <Alert status="info">
        <AlertIcon />
        <AlertDescription>
          Click "Analyze Job" to get AI-powered insights for this position.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <VStack spacing={4} align="stretch">
      {/* Match Score */}
      <Card>
        <CardBody>
          <HStack justify="space-between" mb={2}>
            <Text fontWeight="bold">Match Score</Text>
            <Badge
              colorScheme={analysis.matchScore >= 80 ? 'green' : analysis.matchScore >= 60 ? 'yellow' : 'red'}
              fontSize="lg"
            >
              {analysis.matchScore}%
            </Badge>
          </HStack>
          <Progress
            value={analysis.matchScore}
            colorScheme={analysis.matchScore >= 80 ? 'green' : analysis.matchScore >= 60 ? 'yellow' : 'red'}
            size="lg"
          />
        </CardBody>
      </Card>

      {/* Skills Analysis */}
      <Card>
        <CardBody>
          <Text fontWeight="bold" mb={3}>Skills Analysis</Text>
          <VStack align="stretch" spacing={3}>
            <Box>
              <Text fontSize="sm" fontWeight="medium" color="green.500" mb={1}>
                ✓ Matching Skills ({analysis.matchingSkills.length})
              </Text>
              <Flex wrap="wrap" gap={1}>
                {analysis.matchingSkills.map((skill, index) => (
                  <Badge key={index} colorScheme="green" size="sm">
                    {skill}
                  </Badge>
                ))}
              </Flex>
            </Box>
            <Box>
              <Text fontSize="sm" fontWeight="medium" color="red.500" mb={1}>
                ⚠ Missing Skills ({analysis.missingSkills.length})
              </Text>
              <Flex wrap="wrap" gap={1}>
                {analysis.missingSkills.map((skill, index) => (
                  <Badge key={index} colorScheme="red" size="sm">
                    {skill}
                  </Badge>
                ))}
              </Flex>
            </Box>
          </VStack>
        </CardBody>
      </Card>

      {/* Salary Data */}
      {analysis.salaryData && (
        <Card>
          <CardBody>
            <HStack justify="space-between" mb={2}>
              <Text fontWeight="bold">Salary Range</Text>
              <Icon as={FiDollarSign} color="green.500" />
            </HStack>
            <SimpleGrid columns={3} spacing={2}>
              <Stat size="sm">
                <StatLabel>Min</StatLabel>
                <StatNumber fontSize="md">${analysis.salaryData.min.toLocaleString()}</StatNumber>
              </Stat>
              <Stat size="sm">
                <StatLabel>Median</StatLabel>
                <StatNumber fontSize="md">${analysis.salaryData.median.toLocaleString()}</StatNumber>
              </Stat>
              <Stat size="sm">
                <StatLabel>Max</StatLabel>
                <StatNumber fontSize="md">${analysis.salaryData.max.toLocaleString()}</StatNumber>
              </Stat>
            </SimpleGrid>
          </CardBody>
        </Card>
      )}

      {/* Action Buttons */}
      <ButtonGroup size="sm" spacing={2}>
        <Button colorScheme="blue" onClick={onSaveApplication} leftIcon={<FiBookmark />}>
          Save Application
        </Button>
        <Button variant="outline" onClick={onOpenResumeBuilder} leftIcon={<FiFileText />}>
          Build Resume
        </Button>
      </ButtonGroup>
    </VStack>
  );
};

const ApplicationsPanel: React.FC<{ applications: JobApplication[] }> = ({ applications }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'offer': return 'green';
      case 'interview': return 'blue';
      case 'screening': return 'yellow';
      case 'rejected': return 'red';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'offer': return FiCheckCircle;
      case 'interview': return FiPlay;
      case 'screening': return FiClock;
      case 'rejected': return FiXCircle;
      default: return FiBriefcase;
    }
  };

  return (
    <VStack spacing={3} align="stretch">
      <HStack justify="space-between">
        <Heading size="sm">Recent Applications</Heading>
        <Badge colorScheme="blue">{applications.length}</Badge>
      </HStack>

      {applications.length === 0 ? (
        <Alert status="info">
          <AlertIcon />
          <AlertDescription>
            No applications tracked yet. Save jobs from supported sites to track your progress.
          </AlertDescription>
        </Alert>
      ) : (
        <VStack spacing={2} align="stretch" maxH="300px" overflowY="auto">
          {applications.slice(0, 5).map((app) => (
            <Card key={app.id} size="sm">
              <CardBody>
                <HStack justify="space-between" mb={1}>
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="medium" fontSize="sm" noOfLines={1}>
                      {app.jobTitle}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {app.company} • {app.platform}
                    </Text>
                  </VStack>
                  <Badge
                    colorScheme={getStatusColor(app.status)}
                    size="sm"
                    display="flex"
                    alignItems="center"
                    gap={1}
                  >
                    <Icon as={getStatusIcon(app.status)} />
                    {app.status}
                  </Badge>
                </HStack>
                <HStack justify="space-between">
                  <Text fontSize="xs" color="gray.500">
                    {new Date(app.appliedDate).toLocaleDateString()}
                  </Text>
                  <IconButton
                    size="xs"
                    variant="ghost"
                    aria-label="Open job"
                    icon={<FiExternalLink />}
                    onClick={() => chrome.tabs.create({ url: app.url })}
                  />
                </HStack>
              </CardBody>
            </Card>
          ))}
        </VStack>
      )}
    </VStack>
  );
};

const ProfilePanel: React.FC<{ userProfile: UserProfile | null }> = ({ userProfile }) => {
  if (!userProfile) {
    return (
      <Alert status="warning">
        <AlertIcon />
        <AlertDescription>
          No profile data available. Please set up your profile in the main app.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <VStack spacing={4} align="stretch">
      <Card>
        <CardBody>
          <VStack align="start" spacing={2}>
            <Heading size="md">{userProfile.name}</Heading>
            <Text color="gray.600">{userProfile.currentTitle}</Text>
            <HStack>
              <Badge colorScheme="blue">{userProfile.experience} years exp</Badge>
              <Badge colorScheme="green">{userProfile.skills.length} skills</Badge>
            </HStack>
          </VStack>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <Text fontWeight="bold" mb={3}>Top Skills</Text>
          <Flex wrap="wrap" gap={1}>
            {userProfile.skills.slice(0, 8).map((skill, index) => (
              <Badge key={index} colorScheme="blue" size="sm">
                {skill}
              </Badge>
            ))}
          </Flex>
        </CardBody>
      </Card>

      <SimpleGrid columns={2} spacing={3}>
        <Stat size="sm">
          <StatLabel>Applications</StatLabel>
          <StatNumber>{userProfile.applications.length}</StatNumber>
          <StatHelpText>Total tracked</StatHelpText>
        </Stat>
        <Stat size="sm">
          <StatLabel>This Month</StatLabel>
          <StatNumber>
            {userProfile.applications.filter(app =>
              new Date(app.appliedDate).getMonth() === new Date().getMonth()
            ).length}
          </StatNumber>
          <StatHelpText>
            <StatArrow type="increase" />
            Active
          </StatHelpText>
        </Stat>
      </SimpleGrid>
    </VStack>
  );
};

const ToolsPanel: React.FC<{ onOpenDashboard: () => void }> = ({ onOpenDashboard }) => {
  return (
    <VStack spacing={4} align="stretch">
      <Heading size="sm">Quick Tools</Heading>

      <VStack spacing={2} align="stretch">
        <Button
          variant="outline"
          leftIcon={<FiFileText />}
          onClick={() => chrome.tabs.create({ url: 'http://localhost:5173/resume-builder' })}
        >
          Resume Builder
        </Button>

        <Button
          variant="outline"
          leftIcon={<FiBriefcase />}
          onClick={onOpenDashboard}
        >
          Full Dashboard
        </Button>

        <Button
          variant="outline"
          leftIcon={<FiTrendingUp />}
          onClick={() => chrome.tabs.create({ url: 'http://localhost:5173/analytics' })}
        >
          Job Analytics
        </Button>

        <Button
          variant="outline"
          leftIcon={<FiUsers />}
          onClick={() => chrome.tabs.create({ url: 'http://localhost:5173/network' })}
        >
          Network Insights
        </Button>
      </VStack>

      <Divider />

      <VStack spacing={2} align="stretch">
        <Text fontSize="sm" fontWeight="medium">Extension Settings</Text>
        <Button size="sm" variant="ghost" leftIcon={<FiRefreshCw />}>
          Refresh Data
        </Button>
        <Button size="sm" variant="ghost" leftIcon={<FiSettings />}>
          Preferences
        </Button>
      </VStack>
    </VStack>
  );
};

// Mock Data
const MOCK_ENHANCED_ANALYSIS: JobAnalysis = {
  matchScore: 87,
  matchingSkills: ['React', 'TypeScript', 'Node.js', 'REST APIs', 'Git', 'Agile'],
  missingSkills: ['Docker', 'AWS', 'GraphQL'],
  skillGaps: [
    {
      skill: 'Docker',
      importance: 'high',
      learningResources: ['Docker Official Tutorial', 'Docker for Developers Course']
    },
    {
      skill: 'AWS',
      importance: 'medium',
      learningResources: ['AWS Fundamentals', 'AWS Solutions Architect Path']
    }
  ],
  suggestions: [
    'Highlight your React and TypeScript experience prominently',
    'Add any containerization or cloud experience you have',
    'Consider taking a Docker certification course',
    'Mention any microservices architecture experience'
  ],
  salaryData: {
    min: 95000,
    max: 140000,
    median: 117500,
    currency: 'USD',
    location: 'San Francisco, CA'
  },
  companyInsight: {
    name: 'TechCorp Inc',
    size: '1000-5000 employees',
    industry: 'Software',
    funding: 'Series C',
    glassdoorRating: 4.2,
    linkedinConnections: 12
  },
  interviewQuestions: [
    'How do you handle state management in large React applications?',
    'Explain the difference between REST and GraphQL',
    'How would you optimize a slow-loading web application?',
    'Describe your experience with test-driven development'
  ]
};

const MOCK_USER_PROFILE: UserProfile = {
  name: 'John Developer',
  currentTitle: 'Senior Frontend Developer',
  skills: ['React', 'TypeScript', 'Node.js', 'JavaScript', 'HTML', 'CSS', 'Git', 'Agile', 'REST APIs', 'Jest'],
  experience: 5,
  applications: [
    {
      id: '1',
      jobTitle: 'Senior Frontend Developer',
      company: 'TechCorp',
      platform: 'LinkedIn',
      appliedDate: '2025-07-08T00:00:00Z',
      status: 'interview',
      url: 'https://linkedin.com/jobs/123'
    },
    {
      id: '2',
      jobTitle: 'Full Stack Engineer',
      company: 'StartupXYZ',
      platform: 'Indeed',
      appliedDate: '2025-07-05T00:00:00Z',
      status: 'screening',
      url: 'https://indeed.com/viewjob/456'
    }
  ]
};

// Initialize the popup
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<Popup />);
} else {
  console.error('Failed to find root container');
}

// Add TypeScript type definitions for Chrome extension API
declare global {
  interface Window {
    chrome: typeof chrome;
  }
}
