import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  List,
  ListIcon,
  ListItem,
  Progress,
  SimpleGrid,
  Spacer,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Textarea,
  useToast,
  VStack,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FiAlertTriangle, FiCheckCircle, FiTrendingUp, FiXCircle } from 'react-icons/fi'
import * as apiService from '../services/api'

interface JobAnalysisResult {
  matchScore: number
  matchingSkills: string[]
  missingSkills: string[]
  suggestions: string[]
  analysis: string
}

const JobAnalysisPage: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<JobAnalysisResult | null>(null)
  const toast = useToast()

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      jobTitle: '',
      companyName: '',
      jobDescription: '',
      requirements: '',
      jobUrl: '',
    },
  })

  const onSubmit = async (data: any) => {
    setIsAnalyzing(true)

    try {
      // Call the actual API
      const response = await apiService.analyzeJob(data)

      if (response.success && response.data) {
        setAnalysisResult(response.data)

        toast({
          title: 'Analysis complete!',
          description: 'Job analysis has been completed successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      } else {
        throw new Error(response.error || 'Failed to analyze job')
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to analyze job posting. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'green'
    if (score >= 60) return 'yellow'
    return 'red'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent Match'
    if (score >= 60) return 'Good Match'
    return 'Needs Improvement'
  }

  const handleReset = () => {
    reset()
    setAnalysisResult(null)
  }

  return (
    <VStack spacing={8} align="stretch">
      {/* Header */}
      <Box>
        <Heading as="h1" size="xl" mb={2}>
          Job Analysis
        </Heading>
        <Text color="gray.600">
          Analyze how well your profile matches a job posting
        </Text>
      </Box>

      <Tabs>
        <TabList>
          <Tab>Job Information</Tab>
          {analysisResult && <Tab>Analysis Results</Tab>}
        </TabList>

        <TabPanels>
          {/* Job Information Tab */}
          <TabPanel>
            <form onSubmit={handleSubmit(onSubmit)}>
              <VStack spacing={6} align="stretch">
                <Card>
                  <CardHeader>
                    <Heading as="h2" size="md">
                      Job Posting Details
                    </Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={4}>
                      <HStack w="full" spacing={4}>
                        <FormControl>
                          <FormLabel>Job Title</FormLabel>
                          <Input
                            {...register('jobTitle', { required: true })}
                            placeholder="e.g. Senior Frontend Developer"
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel>Company Name</FormLabel>
                          <Input
                            {...register('companyName', { required: true })}
                            placeholder="e.g. Netflix"
                          />
                        </FormControl>
                      </HStack>

                      <FormControl>
                        <FormLabel>Job URL (Optional)</FormLabel>
                        <Input
                          {...register('jobUrl')}
                          placeholder="https://company.com/careers/job-id"
                          type="url"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Job Description</FormLabel>
                        <Textarea
                          {...register('jobDescription', { required: true })}
                          placeholder="Paste the complete job description here..."
                          rows={8}
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Key Requirements (Optional)</FormLabel>
                        <Textarea
                          {...register('requirements')}
                          placeholder="List specific requirements or skills if you want to highlight them..."
                          rows={4}
                        />
                      </FormControl>
                    </VStack>
                  </CardBody>
                </Card>

                <HStack>
                  <Button
                    type="submit"
                    colorScheme="brand"
                    size="lg"
                    leftIcon={<FiTrendingUp />}
                    isLoading={isAnalyzing}
                    loadingText="Analyzing..."
                    flex={1}
                  >
                    Analyze Job Match
                  </Button>
                  <Button variant="outline" onClick={handleReset}>
                    Reset
                  </Button>
                </HStack>
              </VStack>
            </form>
          </TabPanel>

          {/* Analysis Results Tab */}
          {analysisResult && (
            <TabPanel>
              <VStack spacing={6} align="stretch">
                {/* Overall Score */}
                <Card>
                  <CardHeader>
                    <Heading as="h2" size="md">
                      Match Score
                    </Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={4}>
                      <Box textAlign="center">
                        <Text fontSize="4xl" fontWeight="bold" color={`${getScoreColor(analysisResult.matchScore)}.500`}>
                          {analysisResult.matchScore}%
                        </Text>
                        <Badge colorScheme={getScoreColor(analysisResult.matchScore)} size="lg">
                          {getScoreLabel(analysisResult.matchScore)}
                        </Badge>
                      </Box>
                      <Progress
                        value={analysisResult.matchScore}
                        colorScheme={getScoreColor(analysisResult.matchScore)}
                        size="lg"
                        w="full"
                      />
                    </VStack>
                  </CardBody>
                </Card>

                {/* Skills Analysis */}
                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                  {/* Matching Skills */}
                  <Card>
                    <CardHeader>
                      <Flex align="center">
                        <Heading as="h3" size="md" color="green.500">
                          Matching Skills
                        </Heading>
                        <Spacer />
                        <Badge colorScheme="green" variant="subtle">
                          {analysisResult.matchingSkills.length} skills
                        </Badge>
                      </Flex>
                    </CardHeader>
                    <CardBody>
                      <List spacing={2}>
                        {analysisResult.matchingSkills.map((skill, index) => (
                          <ListItem key={index}>
                            <ListIcon as={FiCheckCircle} color="green.500" />
                            {skill}
                          </ListItem>
                        ))}
                      </List>
                    </CardBody>
                  </Card>

                  {/* Missing Skills */}
                  <Card>
                    <CardHeader>
                      <Flex align="center">
                        <Heading as="h3" size="md" color="red.500">
                          Missing Skills
                        </Heading>
                        <Spacer />
                        <Badge colorScheme="red" variant="subtle">
                          {analysisResult.missingSkills.length} skills
                        </Badge>
                      </Flex>
                    </CardHeader>
                    <CardBody>
                      <List spacing={2}>
                        {analysisResult.missingSkills.map((skill, index) => (
                          <ListItem key={index}>
                            <ListIcon as={FiXCircle} color="red.500" />
                            {skill}
                          </ListItem>
                        ))}
                      </List>
                    </CardBody>
                  </Card>
                </SimpleGrid>

                {/* Analysis Summary */}
                <Card>
                  <CardHeader>
                    <Heading as="h3" size="md">
                      Analysis Summary
                    </Heading>
                  </CardHeader>
                  <CardBody>
                    <Text>{analysisResult.analysis}</Text>
                  </CardBody>
                </Card>

                {/* Suggestions */}
                <Card>
                  <CardHeader>
                    <Heading as="h3" size="md">
                      Recommendations
                    </Heading>
                  </CardHeader>
                  <CardBody>
                    <Alert status="info" mb={4}>
                      <AlertIcon />
                      <Box>
                        <AlertTitle>How to improve your match score:</AlertTitle>
                        <AlertDescription>
                          Focus on the areas below to strengthen your application for this role.
                        </AlertDescription>
                      </Box>
                    </Alert>
                    <List spacing={3}>
                      {analysisResult.suggestions.map((suggestion, index) => (
                        <ListItem key={index}>
                          <ListIcon as={FiAlertTriangle} color="orange.500" />
                          {suggestion}
                        </ListItem>
                      ))}
                    </List>
                  </CardBody>
                </Card>

                {/* Quick Stats */}
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                  <Stat>
                    <StatLabel>Skills Match</StatLabel>
                    <StatNumber color="green.500">{analysisResult.matchingSkills.length}</StatNumber>
                    <StatHelpText>out of {analysisResult.matchingSkills.length + analysisResult.missingSkills.length} required</StatHelpText>
                  </Stat>
                  <Stat>
                    <StatLabel>Skills Gap</StatLabel>
                    <StatNumber color="red.500">{analysisResult.missingSkills.length}</StatNumber>
                    <StatHelpText>skills to learn</StatHelpText>
                  </Stat>
                  <Stat>
                    <StatLabel>Match Strength</StatLabel>
                    <StatNumber color={`${getScoreColor(analysisResult.matchScore)}.500`}>
                      {getScoreLabel(analysisResult.matchScore)}
                    </StatNumber>
                    <StatHelpText>{analysisResult.matchScore}% compatibility</StatHelpText>
                  </Stat>
                </SimpleGrid>
              </VStack>
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
    </VStack>
  )
}

export default JobAnalysisPage
