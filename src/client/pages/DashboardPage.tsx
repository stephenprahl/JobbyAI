import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Spacer,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  VStack,
} from '@chakra-ui/react'
import React from 'react'
import { FiBriefcase, FiFileText, FiPlus, FiStar, FiTrendingUp, FiUser } from 'react-icons/fi'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const DashboardPage: React.FC = () => {
  const { user } = useAuth()

  // Mock data - in a real app, this would come from API calls
  const stats = {
    resumesGenerated: 12,
    jobsAnalyzed: 24,
    averageMatchScore: 78,
    lastActivity: '2 hours ago',
  }

  const recentResumes = [
    {
      id: '1',
      title: 'Software Engineer Resume',
      company: 'Google',
      matchScore: 85,
      createdAt: '2025-01-07',
    },
    {
      id: '2',
      title: 'Frontend Developer Resume',
      company: 'Meta',
      matchScore: 78,
      createdAt: '2025-01-06',
    },
    {
      id: '3',
      title: 'Full Stack Developer Resume',
      company: 'Netflix',
      matchScore: 92,
      createdAt: '2025-01-05',
    },
  ]

  const quickActions = [
    {
      title: 'Generate New Resume',
      description: 'Create a tailored resume for a specific job',
      icon: FiFileText,
      href: '/resume',
      color: 'brand',
    },
    {
      title: 'Analyze Job Posting',
      description: 'Analyze how well your profile matches a job',
      icon: FiBriefcase,
      href: '/jobs',
      color: 'green',
    },
    {
      title: 'Update Profile',
      description: 'Keep your profile information up to date',
      icon: FiUser,
      href: '/profile',
      color: 'purple',
    },
  ]

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'green'
    if (score >= 60) return 'yellow'
    return 'red'
  }

  return (
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

      {/* Stats Overview */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Resumes Generated</StatLabel>
              <StatNumber>{stats.resumesGenerated}</StatNumber>
              <StatHelpText>
                <Icon as={FiTrendingUp} mr={1} />
                +3 this week
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Jobs Analyzed</StatLabel>
              <StatNumber>{stats.jobsAnalyzed}</StatNumber>
              <StatHelpText>
                <Icon as={FiTrendingUp} mr={1} />
                +7 this week
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Avg. Match Score</StatLabel>
              <StatNumber>{stats.averageMatchScore}%</StatNumber>
              <StatHelpText>
                <Icon as={FiStar} mr={1} />
                Excellent
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Last Activity</StatLabel>
              <StatNumber fontSize="lg">{stats.lastActivity}</StatNumber>
              <StatHelpText>Resume generated</StatHelpText>
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
          {quickActions.map((action, index) => (
            <Card key={index} variant="outline" _hover={{ shadow: 'md' }}>
              <CardBody>
                <VStack spacing={4} align="start">
                  <Icon as={action.icon} w={8} h={8} color={`${action.color}.500`} />
                  <VStack spacing={2} align="start">
                    <Heading as="h3" size="md">
                      {action.title}
                    </Heading>
                    <Text color="gray.600" fontSize="sm">
                      {action.description}
                    </Text>
                  </VStack>
                  <Button as={RouterLink} to={action.href} colorScheme={action.color} variant="outline" w="full">
                    Get Started
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      </Box>

      {/* Recent Resumes */}
      <Box>
        <Flex align="center" mb={4}>
          <Heading as="h2" size="lg">
            Recent Resumes
          </Heading>
          <Spacer />
          <Button as={RouterLink} to="/resume" leftIcon={<FiPlus />} colorScheme="brand" variant="outline">
            Create New
          </Button>
        </Flex>

        <Card>
          <CardHeader>
            <Heading as="h3" size="md">
              Your Latest Work
            </Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              {recentResumes.map((resume) => (
                <Box key={resume.id} p={4} border="1px" borderColor="gray.200" borderRadius="md">
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
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </HStack>
                  </Flex>
                </Box>
              ))}
            </VStack>
          </CardBody>
        </Card>
      </Box>
    </VStack>
  )
}

export default DashboardPage
