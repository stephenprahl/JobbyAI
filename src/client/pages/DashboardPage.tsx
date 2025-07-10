import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  IconButton,
  SimpleGrid,
  Spacer,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react'
import React from 'react'
import { FiBriefcase, FiEdit, FiEye, FiFileText, FiPlus, FiStar, FiTrendingUp, FiUser } from 'react-icons/fi'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const DashboardPage: React.FC = () => {
  const { user } = useAuth()
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  // Check if this is a new user (simplified check)
  const isNewUser = !user?.lastLoginAt || new Date(user.lastLoginAt).getTime() > Date.now() - 60000 // Less than 1 minute ago

  // Mock data - in a real app, this would come from API calls
  const stats = {
    resumesGenerated: isNewUser ? 0 : 12,
    jobsAnalyzed: isNewUser ? 0 : 24,
    averageMatchScore: isNewUser ? 0 : 78,
    lastActivity: isNewUser ? 'Just now' : '2 hours ago',
  }

  const recentResumes = [
    {
      id: '1',
      title: 'Software Engineer Resume',
      company: 'Google',
      matchScore: 85,
      createdAt: '2025-01-07',
      status: 'Active'
    },
    {
      id: '2',
      title: 'Frontend Developer Resume',
      company: 'Meta',
      matchScore: 78,
      createdAt: '2025-01-06',
      status: 'Draft'
    },
    {
      id: '3',
      title: 'Full Stack Developer Resume',
      company: 'Netflix',
      matchScore: 92,
      createdAt: '2025-01-05',
      status: 'Active'
    },
  ]

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'green'
    if (score >= 60) return 'yellow'
    return 'red'
  }

  return (
    <Container maxW="7xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Welcome Section */}
        <Box>
          <Heading as="h1" size="xl" mb={2}>
            Welcome back, {user?.firstName || 'there'}! 👋
          </Heading>
          <Text color="gray.600" fontSize="lg">
            Ready to take your job search to the next level?
          </Text>
        </Box>

        {/* New User Getting Started Card */}
        {isNewUser && (
          <Card bg="blue.50" borderColor="blue.200" borderWidth={2}>
            <CardBody>
              <VStack spacing={4} align="start">
                <HStack spacing={2}>
                  <Icon as={FiStar} color="blue.500" />
                  <Heading size="md" color="blue.700">
                    Welcome to Resume Plan AI!
                  </Heading>
                </HStack>
                <Text color="blue.600">
                  Get started by creating your first AI-powered resume or analyzing a job posting to see how well you match.
                </Text>
                <HStack spacing={4}>
                  <Button
                    as={RouterLink}
                    to="/resume/builder"
                    colorScheme="blue"
                    leftIcon={<Icon as={FiFileText} />}
                  >
                    Build Your Resume
                  </Button>
                  <Button
                    as={RouterLink}
                    to="/jobs"
                    variant="outline"
                    colorScheme="blue"
                    leftIcon={<Icon as={FiBriefcase} />}
                  >
                    Analyze a Job
                  </Button>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        )}

        {/* Stats Overview */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Resumes Generated</StatLabel>
                <StatNumber>{stats.resumesGenerated}</StatNumber>
                <StatHelpText>
                  <Icon as={FiTrendingUp} mr={1} />
                  {isNewUser ? 'Start creating!' : '+3 this week'}
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Jobs Analyzed</StatLabel>
                <StatNumber>{stats.jobsAnalyzed}</StatNumber>
                <StatHelpText>
                  <Icon as={FiTrendingUp} mr={1} />
                  {isNewUser ? 'Analyze jobs!' : '+7 this week'}
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Avg. Match Score</StatLabel>
                <StatNumber>{stats.averageMatchScore}{isNewUser ? '' : '%'}</StatNumber>
                <StatHelpText>
                  <Icon as={FiStar} mr={1} />
                  {isNewUser ? 'Start analyzing!' : 'Excellent'}
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Last Activity</StatLabel>
                <StatNumber fontSize="lg">{stats.lastActivity}</StatNumber>
                <StatHelpText>{isNewUser ? 'Welcome!' : 'Resume generated'}</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Quick Actions */}
        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Quick Actions
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <Card bg={cardBg} borderColor={borderColor} variant="outline" _hover={{ shadow: 'md' }}>
              <CardBody>
                <VStack spacing={4} align="start">
                  <Icon as={FiFileText} w={8} h={8} color="blue.500" />
                  <VStack spacing={2} align="start">
                    <Heading as="h3" size="md">
                      Create New Resume
                    </Heading>
                    <Text color="gray.600" fontSize="sm">
                      Build a tailored resume with our AI-powered builder
                    </Text>
                  </VStack>
                  <Button as={RouterLink} to="/resume/builder" colorScheme="blue" variant="outline" w="full">
                    Get Started
                  </Button>
                </VStack>
              </CardBody>
            </Card>

            <Card bg={cardBg} borderColor={borderColor} variant="outline" _hover={{ shadow: 'md' }}>
              <CardBody>
                <VStack spacing={4} align="start">
                  <Icon as={FiBriefcase} w={8} h={8} color="green.500" />
                  <VStack spacing={2} align="start">
                    <Heading as="h3" size="md">
                      Analyze Job Posting
                    </Heading>
                    <Text color="gray.600" fontSize="sm">
                      See how well your profile matches job requirements
                    </Text>
                  </VStack>
                  <Button as={RouterLink} to="/jobs" colorScheme="green" variant="outline" w="full">
                    Get Started
                  </Button>
                </VStack>
              </CardBody>
            </Card>

            <Card bg={cardBg} borderColor={borderColor} variant="outline" _hover={{ shadow: 'md' }}>
              <CardBody>
                <VStack spacing={4} align="start">
                  <Icon as={FiUser} w={8} h={8} color="purple.500" />
                  <VStack spacing={2} align="start">
                    <Heading as="h3" size="md">
                      Update Profile
                    </Heading>
                    <Text color="gray.600" fontSize="sm">
                      Keep your profile information up to date
                    </Text>
                  </VStack>
                  <Button as={RouterLink} to="/profile" colorScheme="purple" variant="outline" w="full">
                    Get Started
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          </SimpleGrid>
        </Box>

        {/* Recent Activity */}
        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
          <GridItem>
            <Box>
              <Flex align="center" mb={4}>
                <Heading as="h2" size="lg">
                  Recent Resumes
                </Heading>
                <Spacer />
                <Button as={RouterLink} to="/resume" leftIcon={<FiPlus />} colorScheme="blue" variant="outline">
                  View All
                </Button>
              </Flex>

              <Card bg={cardBg} borderColor={borderColor}>
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    {recentResumes.map((resume) => (
                      <Box key={resume.id} p={4} border="1px" borderColor={borderColor} borderRadius="md">
                        <Flex align="center">
                          <VStack align="start" spacing={1} flex={1}>
                            <Heading as="h4" size="sm">
                              {resume.title}
                            </Heading>
                            <Text color="gray.600" fontSize="sm">
                              {resume.company} • {resume.createdAt}
                            </Text>
                          </VStack>
                          <HStack spacing={3}>
                            <Badge colorScheme={getScoreColor(resume.matchScore)} variant="subtle">
                              {resume.matchScore}% match
                            </Badge>
                            <Badge colorScheme="gray" variant="outline">
                              {resume.status}
                            </Badge>
                            <HStack spacing={1}>
                              <IconButton
                                aria-label="View resume"
                                icon={<FiEye />}
                                size="sm"
                                variant="ghost"
                              />
                              <IconButton
                                aria-label="Edit resume"
                                icon={<FiEdit />}
                                size="sm"
                                variant="ghost"
                              />
                            </HStack>
                          </HStack>
                        </Flex>
                      </Box>
                    ))}
                  </VStack>
                </CardBody>
              </Card>
            </Box>
          </GridItem>

          <GridItem>
            <Box>
              <Heading as="h2" size="lg" mb={4}>
                Tips & Insights
              </Heading>
              <VStack spacing={4} align="stretch">
                <Card bg={cardBg} borderColor={borderColor}>
                  <CardBody>
                    <VStack align="start" spacing={3}>
                      <Icon as={FiTrendingUp} color="green.500" w={6} h={6} />
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="semibold">Great Progress!</Text>
                        <Text fontSize="sm" color="gray.600">
                          Your average match score has improved by 12% this month.
                        </Text>
                      </VStack>
                    </VStack>
                  </CardBody>
                </Card>

                <Card bg={cardBg} borderColor={borderColor}>
                  <CardBody>
                    <VStack align="start" spacing={3}>
                      <Icon as={FiStar} color="blue.500" w={6} h={6} />
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="semibold">Pro Tip</Text>
                        <Text fontSize="sm" color="gray.600">
                          Adding quantifiable achievements can boost your match score by up to 15%.
                        </Text>
                      </VStack>
                    </VStack>
                  </CardBody>
                </Card>

                <Card bg={cardBg} borderColor={borderColor}>
                  <CardBody>
                    <VStack align="start" spacing={3}>
                      <Icon as={FiBriefcase} color="purple.500" w={6} h={6} />
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="semibold">Trending Skills</Text>
                        <Text fontSize="sm" color="gray.600">
                          React, TypeScript, and AWS are highly sought after this week.
                        </Text>
                      </VStack>
                    </VStack>
                  </CardBody>
                </Card>
              </VStack>
            </Box>
          </GridItem>
        </Grid>
      </VStack>
    </Container>
  )
}

export default DashboardPage
