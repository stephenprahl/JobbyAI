import {
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Flex,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react'
import React from 'react'
import { FiBriefcase, FiFileText, FiStar, FiTarget, FiTrendingUp, FiZap } from 'react-icons/fi'
import { Link as RouterLink } from 'react-router-dom'

const LandingPage: React.FC = () => {
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const headerBg = useColorModeValue('white', 'gray.800')
  const features = [
    {
      icon: FiFileText,
      title: 'AI-Powered Resume Builder',
      description: 'Create tailored resumes that match job requirements using advanced AI technology.',
      color: 'brand',
      bgGradient: 'linear(135deg, brand.400, brand.600)',
    },
    {
      icon: FiBriefcase,
      title: 'Job Analysis',
      description: 'Analyze job postings and get insights on how well your profile matches the requirements.',
      color: 'purple',
      bgGradient: 'linear(135deg, purple.400, purple.600)',
    },
    {
      icon: FiZap,
      title: 'Quick Generation',
      description: 'Generate professional resumes in seconds, not hours.',
      color: 'green',
      bgGradient: 'linear(135deg, green.400, green.600)',
    },
    {
      icon: FiTarget,
      title: 'Targeted Content',
      description: 'Every resume is customized to highlight the most relevant skills and experiences.',
      color: 'orange',
      bgGradient: 'linear(135deg, orange.400, orange.600)',
    },
    {
      icon: FiStar,
      title: 'Multiple Formats',
      description: 'Export your resume in various formats including PDF, HTML, and Markdown.',
      color: 'accent',
      bgGradient: 'linear(135deg, accent.400, accent.600)',
    },
    {
      icon: FiTrendingUp,
      title: 'Improve Match Score',
      description: 'Get suggestions to improve your resume and increase your job match score.',
      color: 'purple',
      bgGradient: 'linear(135deg, purple.400, purple.600)',
    },
  ]

  return (
    <Box>
      {/* Header */}
      <Box bg={headerBg} boxShadow="xl" borderBottom="1px" borderColor={borderColor}>
        <Container maxW="7xl">
          <Flex h={16} alignItems="center" justifyContent="space-between">
            <Text
              fontSize="xl"
              fontWeight="bold"
              bgGradient="linear(to-r, brand.400, purple.400)"
              bgClip="text"
            >
              Resume Plan AI
            </Text>
            <HStack spacing={4}>
              <Button as={RouterLink} to="/login" variant="ghost">
                Sign In
              </Button>
              <Button as={RouterLink} to="/register" colorScheme="brand">
                Get Started
              </Button>
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box
        bgGradient="linear(135deg, brand.500, purple.500, accent.500)"
        color="white"
        py={20}
        position="relative"
        overflow="hidden"
        _before={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgGradient: 'linear(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
          animation: 'shimmer 3s ease-in-out infinite',
        }}
      >
        <Container maxW="7xl">
          <VStack spacing={8} textAlign="center">
            <Heading as="h1" size="2xl" maxW="4xl">
              Create Perfect Resumes with AI
            </Heading>
            <Text fontSize="xl" maxW="2xl" opacity={0.9}>
              Transform your job search with AI-powered resume generation. Analyze job postings,
              match your skills, and create tailored resumes that get you noticed.
            </Text>
            <Stack direction={{ base: 'column', sm: 'row' }} spacing={4}>
              <Button as={RouterLink} to="/register" size="lg" colorScheme="white" variant="solid">
                Start Building Now
              </Button>
              <Button as={RouterLink} to="/login" size="lg" variant="outline" color="white" borderColor="white">
                Sign In
              </Button>
            </Stack>
          </VStack>
        </Container>
      </Box>

      {/* Features Section */}
      <Box py={20} bg={cardBg}>
        <Container maxW="7xl">
          <VStack spacing={16}>
            <VStack spacing={4} textAlign="center">
              <Heading as="h2" size="xl">
                Why Choose Resume Plan AI?
              </Heading>
              <Text fontSize="lg" color="gray.600" maxW="2xl">
                Our AI-powered platform helps you create resumes that stand out and get results.
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
              {features.map((feature, index) => (
                <Card
                  key={index}
                  bg={cardBg}
                  borderColor={borderColor}
                  _hover={{
                    transform: 'translateY(-4px)',
                    boxShadow: 'xl',
                    borderColor: `${feature.color}.300`
                  }}
                  transition="all 0.3s"
                  h="full"
                >
                  <CardBody>
                    <VStack spacing={4} align="start" h="full">
                      <Icon as={feature.icon} w={8} h={8} color="brand.500" />
                      <Heading as="h3" size="md">
                        {feature.title}
                      </Heading>
                      <Text color="gray.600" flex={1}>
                        {feature.description}
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box bg="gray.100" py={20}>
        <Container maxW="7xl">
          <VStack spacing={8} textAlign="center">
            <Heading as="h2" size="xl">
              Ready to Land Your Dream Job?
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              Join thousands of job seekers who have already improved their job search with Resume Plan AI.
            </Text>
            <Button as={RouterLink} to="/register" size="lg" colorScheme="brand">
              Get Started for Free
            </Button>
          </VStack>
        </Container>
      </Box>

      {/* Footer */}
      <Box bg="gray.800" color="white" py={8}>
        <Container maxW="7xl">
          <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align="center">
            <Text>&copy; 2025 Resume Plan AI. All rights reserved.</Text>
            <HStack spacing={6}>
              <Text as="a" href="#" _hover={{ textDecoration: 'underline' }}>
                Privacy Policy
              </Text>
              <Text as="a" href="#" _hover={{ textDecoration: 'underline' }}>
                Terms of Service
              </Text>
              <Text as="a" href="#" _hover={{ textDecoration: 'underline' }}>
                Support
              </Text>
            </HStack>
          </Flex>
        </Container>
      </Box>
    </Box>
  )
}

export default LandingPage
