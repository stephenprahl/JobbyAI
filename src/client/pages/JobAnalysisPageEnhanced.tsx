import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  Input,
  Progress,
  SimpleGrid,
  Spinner,
  Text,
  Textarea,
  useColorModeValue,
  useToast,
  VStack,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import {
  FiAlertCircle,
  FiBriefcase,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiMapPin,
  FiSearch,
  FiTarget,
  FiTrendingUp,
  FiUpload,
  FiUsers,
} from 'react-icons/fi'
import { analyzeJob } from '../services/api'

interface JobAnalysis {
  matchScore: number
  missingSkills: string[]
  matchingSkills: string[]
  recommendations: string[]
  salaryRange?: {
    min: number
    max: number
    currency: string
  }
  jobDetails: {
    title: string
    company: string
    location: string
    type: string
    experience: string
    description: string
    requirements: string[]
  }
}

const JobAnalysisPage: React.FC = () => {
  const [jobUrl, setJobUrl] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<JobAnalysis | null>(null)
  const [analysisHistory, setAnalysisHistory] = useState<JobAnalysis[]>([])

  const toast = useToast()
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  const analyzeJobListing = async () => {
    if (!jobUrl && !jobDescription) {
      toast({
        title: 'Input Required',
        description: 'Please provide either a job URL or job description.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setIsAnalyzing(true)

    try {
      // Extract job title and company from description or URL
      const jobTitle = extractJobTitle(jobDescription) || 'Software Engineer'
      const company = extractCompany(jobDescription) || 'Company'

      const result = await analyzeJob({
        jobUrl,
        jobDescription,
        jobTitle,
        company,
        location: 'Remote',
        requirements: extractRequirements(jobDescription)
      })

      if (result.success && result.data) {
        const analysisResult: JobAnalysis = result.data

        setAnalysis(analysisResult)
        setAnalysisHistory(prev => [analysisResult, ...prev.slice(0, 4)])

        toast({
          title: 'Analysis Complete!',
          description: `Job match score: ${analysisResult.matchScore}%`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      } else {
        throw new Error(result.error || 'Analysis failed')
      }
    } catch (error) {
      toast({
        title: 'Analysis Failed',
        description: 'There was an error analyzing the job. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'green'
    if (score >= 60) return 'yellow'
    return 'red'
  }

  const MatchScoreCard = ({ score }: { score: number }) => (
    <Card bg={cardBg} borderColor={borderColor}>
      <CardBody textAlign="center">
        <VStack spacing={4}>
          <Icon as={FiTarget} size="48px" color={getMatchScoreColor(score)} />
          <VStack spacing={1}>
            <Text fontSize="3xl" fontWeight="bold" color={getMatchScoreColor(score)}>
              {score}%
            </Text>
            <Text color="gray.600">Match Score</Text>
          </VStack>
          <Progress
            value={score}
            colorScheme={getMatchScoreColor(score)}
            size="lg"
            w="full"
            borderRadius="md"
          />
        </VStack>
      </CardBody>
    </Card>
  )

  const SkillsAnalysisCard = ({
    matchingSkills,
    missingSkills
  }: {
    matchingSkills: string[]
    missingSkills: string[]
  }) => (
    <Card bg={cardBg} borderColor={borderColor}>
      <CardHeader>
        <Heading size="md">Skills Analysis</Heading>
      </CardHeader>
      <CardBody>
        <VStack spacing={6} align="stretch">
          <VStack spacing={3} align="stretch">
            <HStack>
              <Icon as={FiCheckCircle} color="green.500" />
              <Text fontWeight="semibold">Matching Skills ({matchingSkills.length})</Text>
            </HStack>
            <Flex wrap="wrap" gap={2}>
              {matchingSkills.map((skill, index) => (
                <Badge key={index} colorScheme="green" variant="subtle">
                  {skill}
                </Badge>
              ))}
            </Flex>
          </VStack>

          <Divider />

          <VStack spacing={3} align="stretch">
            <HStack>
              <Icon as={FiAlertCircle} color="orange.500" />
              <Text fontWeight="semibold">Missing Skills ({missingSkills.length})</Text>
            </HStack>
            <Flex wrap="wrap" gap={2}>
              {missingSkills.map((skill, index) => (
                <Badge key={index} colorScheme="orange" variant="subtle">
                  {skill}
                </Badge>
              ))}
            </Flex>
          </VStack>
        </VStack>
      </CardBody>
    </Card>
  )

  const RecommendationsCard = ({ recommendations }: { recommendations: string[] }) => (
    <Card bg={cardBg} borderColor={borderColor}>
      <CardHeader>
        <HStack>
          <Icon as={FiTrendingUp} />
          <Heading size="md">Recommendations</Heading>
        </HStack>
      </CardHeader>
      <CardBody>
        <VStack spacing={3} align="stretch">
          {recommendations.map((rec, index) => (
            <HStack key={index} align="start" spacing={3}>
              <Box
                w="6px"
                h="6px"
                borderRadius="full"
                bg="blue.500"
                mt="6px"
                flexShrink={0}
              />
              <Text fontSize="sm">{rec}</Text>
            </HStack>
          ))}
        </VStack>
      </CardBody>
    </Card>
  )

  const JobDetailsCard = ({ jobDetails, salaryRange }: {
    jobDetails: JobAnalysis['jobDetails']
    salaryRange?: JobAnalysis['salaryRange']
  }) => (
    <Card bg={cardBg} borderColor={borderColor}>
      <CardHeader>
        <HStack>
          <Icon as={FiBriefcase} />
          <Heading size="md">Job Details</Heading>
        </HStack>
      </CardHeader>
      <CardBody>
        <VStack spacing={4} align="stretch">
          <VStack spacing={2} align="start">
            <Text fontSize="xl" fontWeight="bold">{jobDetails.title}</Text>
            <Text fontSize="lg" color="blue.600">{jobDetails.company}</Text>
          </VStack>

          <SimpleGrid columns={2} spacing={4}>
            <HStack>
              <Icon as={FiMapPin} />
              <Text fontSize="sm">{jobDetails.location}</Text>
            </HStack>
            <HStack>
              <Icon as={FiClock} />
              <Text fontSize="sm">{jobDetails.type}</Text>
            </HStack>
            <HStack>
              <Icon as={FiUsers} />
              <Text fontSize="sm">{jobDetails.experience}</Text>
            </HStack>
            {salaryRange && (
              <HStack>
                <Icon as={FiDollarSign} />
                <Text fontSize="sm">
                  ${salaryRange.min.toLocaleString()} - ${salaryRange.max.toLocaleString()}
                </Text>
              </HStack>
            )}
          </SimpleGrid>

          <VStack spacing={3} align="stretch">
            <Text fontWeight="semibold">Requirements:</Text>
            <VStack spacing={1} align="stretch" pl={4}>
              {jobDetails.requirements.map((req, index) => (
                <HStack key={index} align="start">
                  <Box
                    w="4px"
                    h="4px"
                    borderRadius="full"
                    bg="gray.400"
                    mt="8px"
                    flexShrink={0}
                  />
                  <Text fontSize="sm">{req}</Text>
                </HStack>
              ))}
            </VStack>
          </VStack>
        </VStack>
      </CardBody>
    </Card>
  )

  const AnalysisHistoryCard = ({ history }: { history: JobAnalysis[] }) => (
    <Card bg={cardBg} borderColor={borderColor}>
      <CardHeader>
        <Heading size="md">Recent Analyses</Heading>
      </CardHeader>
      <CardBody>
        <VStack spacing={3} align="stretch">
          {history.length === 0 ? (
            <Text color="gray.500" textAlign="center">No previous analyses</Text>
          ) : (
            history.map((item, index) => (
              <HStack key={index} justify="space-between" p={3} bg="gray.50" borderRadius="md">
                <VStack align="start" spacing={1}>
                  <Text fontWeight="semibold" fontSize="sm">{item.jobDetails.title}</Text>
                  <Text fontSize="xs" color="gray.600">{item.jobDetails.company}</Text>
                </VStack>
                <Badge colorScheme={getMatchScoreColor(item.matchScore)}>
                  {item.matchScore}%
                </Badge>
              </HStack>
            ))
          )}
        </VStack>
      </CardBody>
    </Card>
  )

  // Helper functions to extract information from job description
  const extractJobTitle = (description: string): string => {
    // Simple extraction - in a real app, this would be more sophisticated
    const lines = description.split('\n')
    const firstLine = lines[0]?.trim()
    if (firstLine && firstLine.length < 100) {
      return firstLine
    }
    return 'Software Engineer'
  }

  const extractCompany = (description: string): string => {
    // Look for company patterns in the description
    const companyPatterns = [
      /(?:at|@)\s+([A-Z][a-zA-Z\s&]+)/,
      /Company:\s*([A-Z][a-zA-Z\s&]+)/i,
      /([A-Z][a-zA-Z\s&]+)\s+is\s+looking/i
    ]

    for (const pattern of companyPatterns) {
      const match = description.match(pattern)
      if (match && match[1]) {
        return match[1].trim()
      }
    }
    return 'Company'
  }

  const extractRequirements = (description: string): string[] => {
    // Extract bullet points or numbered lists as requirements
    const lines = description.split('\n')
    const requirements: string[] = []

    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed.match(/^[-•*]\s+/) || trimmed.match(/^\d+\.\s+/)) {
        requirements.push(trimmed.replace(/^[-•*]\s+/, '').replace(/^\d+\.\s+/, ''))
      }
    }

    // If no structured requirements found, return some defaults
    if (requirements.length === 0) {
      return [
        'Relevant experience in the field',
        'Strong communication skills',
        'Ability to work in a team environment',
        'Problem-solving capabilities'
      ]
    }

    return requirements.slice(0, 10) // Limit to 10 requirements
  }

  return (
    <Container maxW="7xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <VStack align="start" spacing={2}>
          <Heading size="lg">Job Analysis</Heading>
          <Text color="gray.600">
            Analyze job postings and see how well your profile matches the requirements
          </Text>
        </VStack>

        {/* Input Section */}
        <Card bg={cardBg} borderColor={borderColor}>
          <CardHeader>
            <Heading size="md">Analyze a Job</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <VStack spacing={2} align="stretch">
                <Text fontWeight="semibold">Job URL (optional)</Text>
                <HStack>
                  <Input
                    placeholder="https://linkedin.com/jobs/view/123456789"
                    value={jobUrl}
                    onChange={(e) => setJobUrl(e.target.value)}
                  />
                  <Button leftIcon={<Icon as={FiUpload} />} variant="outline">
                    Import
                  </Button>
                </HStack>
              </VStack>

              <VStack spacing={2} align="stretch">
                <Text fontWeight="semibold">Or paste job description</Text>
                <Textarea
                  placeholder="Paste the job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  minH="120px"
                />
              </VStack>

              <Button
                leftIcon={isAnalyzing ? <Spinner size="sm" /> : <Icon as={FiSearch} />}
                colorScheme="blue"
                isLoading={isAnalyzing}
                loadingText="Analyzing..."
                onClick={analyzeJobListing}
                size="lg"
              >
                Analyze Job Match
              </Button>
            </VStack>
          </CardBody>
        </Card>

        {/* Analysis Results */}
        {analysis && (
          <Grid templateColumns={{ base: '1fr', lg: '1fr 2fr' }} gap={8}>
            <GridItem>
              <VStack spacing={6} align="stretch">
                <MatchScoreCard score={analysis.matchScore} />
                <AnalysisHistoryCard history={analysisHistory} />
              </VStack>
            </GridItem>

            <GridItem>
              <VStack spacing={6} align="stretch">
                <JobDetailsCard
                  jobDetails={analysis.jobDetails}
                  salaryRange={analysis.salaryRange}
                />
                <SkillsAnalysisCard
                  matchingSkills={analysis.matchingSkills}
                  missingSkills={analysis.missingSkills}
                />
                <RecommendationsCard recommendations={analysis.recommendations} />
              </VStack>
            </GridItem>
          </Grid>
        )}

        {/* Empty State */}
        {!analysis && (
          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody py={16}>
              <VStack spacing={4}>
                <Icon as={FiSearch} size="48px" color="gray.400" />
                <VStack spacing={2}>
                  <Text fontSize="lg" fontWeight="semibold" color="gray.600">
                    Ready to analyze your job match?
                  </Text>
                  <Text color="gray.500" textAlign="center">
                    Provide a job URL or description above to get started with AI-powered analysis
                  </Text>
                </VStack>
              </VStack>
            </CardBody>
          </Card>
        )}
      </VStack>
    </Container>
  )
}

export default JobAnalysisPage
