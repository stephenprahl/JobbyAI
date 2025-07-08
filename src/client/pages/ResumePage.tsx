import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Code,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Spacer,
  Switch,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Textarea,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FiCopy, FiDownload, FiEye, FiFileText } from 'react-icons/fi'
import ReactMarkdown from 'react-markdown'
import * as apiService from '../services/api'

const ResumePage: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedResume, setGeneratedResume] = useState<string | null>(null)
  const [resumeFormat, setResumeFormat] = useState('markdown')
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      jobTitle: '',
      companyName: '',
      jobDescription: '',
      requirements: '',
      format: 'markdown',
      includeSummary: true,
      includeSkills: true,
      includeExperience: true,
      includeEducation: true,
      includeCertifications: true,
      maxLength: 1000,
    },
  })

  const formatOptions = [
    { value: 'markdown', label: 'Markdown', description: 'Simple text format with formatting' },
    { value: 'html', label: 'HTML', description: 'Web-ready HTML format' },
    { value: 'text', label: 'Plain Text', description: 'Simple text without formatting' },
    { value: 'pdf', label: 'PDF', description: 'Coming soon...', disabled: true },
  ]

  const watchedFormat = watch('format')

  const onSubmit = async (data: any) => {
    setIsGenerating(true)

    try {
      // Call the actual API
      const response = await apiService.generateResume(data)

      if (response.success && response.data) {
        setGeneratedResume(response.data.content)
        setResumeFormat(response.data.format)

        toast({
          title: 'Resume generated!',
          description: 'Your tailored resume has been successfully generated.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      } else {
        throw new Error(response.error || 'Failed to generate resume')
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate resume. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopyToClipboard = () => {
    if (generatedResume) {
      navigator.clipboard.writeText(generatedResume)
      toast({
        title: 'Copied!',
        description: 'Resume content copied to clipboard.',
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
    }
  }

  const handleDownload = () => {
    if (generatedResume) {
      const blob = new Blob([generatedResume], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `resume.${resumeFormat === 'markdown' ? 'md' : resumeFormat}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  return (
    <VStack spacing={8} align="stretch">
      {/* Header */}
      <Box>
        <Heading as="h1" size="xl" mb={2}>
          Resume Builder
        </Heading>
        <Text color="gray.600">
          Generate a tailored resume based on job requirements
        </Text>
      </Box>

      <Tabs>
        <TabList>
          <Tab>Job Information</Tab>
          <Tab>Resume Options</Tab>
          {generatedResume && <Tab>Generated Resume</Tab>}
        </TabList>

        <TabPanels>
          {/* Job Information Tab */}
          <TabPanel>
            <form onSubmit={handleSubmit(onSubmit)}>
              <VStack spacing={6} align="stretch">
                <Card>
                  <CardHeader>
                    <Heading as="h2" size="md">
                      Job Details
                    </Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={4}>
                      <HStack w="full" spacing={4}>
                        <FormControl>
                          <FormLabel>Job Title</FormLabel>
                          <Input
                            {...register('jobTitle', { required: true })}
                            placeholder="e.g. Senior Software Engineer"
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel>Company Name</FormLabel>
                          <Input
                            {...register('companyName', { required: true })}
                            placeholder="e.g. Google"
                          />
                        </FormControl>
                      </HStack>

                      <FormControl>
                        <FormLabel>Job Description</FormLabel>
                        <Textarea
                          {...register('jobDescription', { required: true })}
                          placeholder="Paste the complete job description here..."
                          rows={6}
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Key Requirements (Optional)</FormLabel>
                        <Textarea
                          {...register('requirements')}
                          placeholder="List specific requirements or skills mentioned in the job posting..."
                          rows={4}
                        />
                      </FormControl>
                    </VStack>
                  </CardBody>
                </Card>
              </VStack>
            </form>
          </TabPanel>

          {/* Resume Options Tab */}
          <TabPanel>
            <VStack spacing={6} align="stretch">
              <Card>
                <CardHeader>
                  <Heading as="h2" size="md">
                    Format Options
                  </Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={4}>
                    <FormControl>
                      <FormLabel>Output Format</FormLabel>
                      <Select {...register('format')} value={watchedFormat}>
                        {formatOptions.map((option) => (
                          <option
                            key={option.value}
                            value={option.value}
                            disabled={option.disabled}
                          >
                            {option.label} - {option.description}
                          </option>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Maximum Length (words)</FormLabel>
                      <NumberInput min={500} max={2000} defaultValue={1000}>
                        <NumberInputField {...register('maxLength')} />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                  </VStack>
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <Heading as="h2" size="md">
                    Sections to Include
                  </Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={4}>
                    <FormControl display="flex" alignItems="center">
                      <FormLabel htmlFor="summary" mb="0" flex={1}>
                        Professional Summary
                      </FormLabel>
                      <Switch id="summary" {...register('includeSummary')} defaultChecked />
                    </FormControl>

                    <FormControl display="flex" alignItems="center">
                      <FormLabel htmlFor="skills" mb="0" flex={1}>
                        Technical Skills
                      </FormLabel>
                      <Switch id="skills" {...register('includeSkills')} defaultChecked />
                    </FormControl>

                    <FormControl display="flex" alignItems="center">
                      <FormLabel htmlFor="experience" mb="0" flex={1}>
                        Work Experience
                      </FormLabel>
                      <Switch id="experience" {...register('includeExperience')} defaultChecked />
                    </FormControl>

                    <FormControl display="flex" alignItems="center">
                      <FormLabel htmlFor="education" mb="0" flex={1}>
                        Education
                      </FormLabel>
                      <Switch id="education" {...register('includeEducation')} defaultChecked />
                    </FormControl>

                    <FormControl display="flex" alignItems="center">
                      <FormLabel htmlFor="certifications" mb="0" flex={1}>
                        Certifications
                      </FormLabel>
                      <Switch
                        id="certifications"
                        {...register('includeCertifications')}
                        defaultChecked
                      />
                    </FormControl>
                  </VStack>
                </CardBody>
              </Card>

              <Button
                type="submit"
                colorScheme="brand"
                size="lg"
                leftIcon={<FiFileText />}
                onClick={handleSubmit(onSubmit)}
                isLoading={isGenerating}
                loadingText="Generating Resume..."
              >
                Generate Resume
              </Button>
            </VStack>
          </TabPanel>

          {/* Generated Resume Tab */}
          {generatedResume && (
            <TabPanel>
              <VStack spacing={6} align="stretch">
                <Card>
                  <CardHeader>
                    <Flex align="center">
                      <VStack align="start" spacing={1}>
                        <Heading as="h2" size="md">
                          Your Generated Resume
                        </Heading>
                        <HStack>
                          <Badge colorScheme="green">Generated</Badge>
                          <Badge variant="outline">{resumeFormat.toUpperCase()}</Badge>
                        </HStack>
                      </VStack>
                      <Spacer />
                      <HStack>
                        <IconButton
                          aria-label="Copy to clipboard"
                          icon={<FiCopy />}
                          onClick={handleCopyToClipboard}
                          variant="outline"
                        />
                        <IconButton
                          aria-label="Preview"
                          icon={<FiEye />}
                          onClick={onOpen}
                          variant="outline"
                        />
                        <IconButton
                          aria-label="Download"
                          icon={<FiDownload />}
                          onClick={handleDownload}
                          colorScheme="brand"
                        />
                      </HStack>
                    </Flex>
                  </CardHeader>
                  <CardBody>
                    <Box
                      bg="gray.50"
                      p={4}
                      borderRadius="md"
                      border="1px"
                      borderColor="gray.200"
                      maxH="500px"
                      overflowY="auto"
                    >
                      <Code
                        display="block"
                        whiteSpace="pre-wrap"
                        fontSize="sm"
                        bg="transparent"
                        p={0}
                      >
                        {generatedResume}
                      </Code>
                    </Box>
                  </CardBody>
                </Card>
              </VStack>
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>

      {/* Preview Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Resume Preview</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box
              p={6}
              bg="white"
              border="1px"
              borderColor="gray.200"
              borderRadius="md"
              maxH="70vh"
              overflowY="auto"
            >
              {resumeFormat === 'markdown' ? (
                <ReactMarkdown>{generatedResume || ''}</ReactMarkdown>
              ) : resumeFormat === 'html' ? (
                <div dangerouslySetInnerHTML={{ __html: generatedResume || '' }} />
              ) : (
                <Text whiteSpace="pre-wrap">{generatedResume}</Text>
              )}
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  )
}

export default ResumePage
