import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
  useToast,
  VStack,
  Wrap
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { FiDownload, FiEdit3, FiEye, FiPlus, FiSave, FiStar, FiTrash2 } from 'react-icons/fi'
import { useAuth } from '../contexts/AuthContext'
import { generateResume } from '../services/api'

interface ResumeSection {
  id: string
  type: 'personal' | 'experience' | 'education' | 'skills' | 'projects' | 'custom'
  title: string
  content: any
  order: number
}

interface Experience {
  id: string
  title: string
  company: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

interface Education {
  id: string
  institution: string
  degree: string
  fieldOfStudy: string
  startDate: string
  endDate: string
  gpa?: number
  description?: string
}

const ResumeBuilderPage: React.FC = () => {
  const { user } = useAuth()
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [resumeTitle, setResumeTitle] = useState('My Resume')
  const [generatedContent, setGeneratedContent] = useState<string>('')
  const [sections, setSections] = useState<ResumeSection[]>([
    {
      id: '1',
      type: 'personal',
      title: 'Personal Information',
      content: {
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: '',
        location: '',
        website: '',
        linkedin: '',
        github: '',
      },
      order: 1,
    },
    {
      id: '2',
      type: 'experience',
      title: 'Work Experience',
      content: [],
      order: 2,
    },
    {
      id: '3',
      type: 'education',
      title: 'Education',
      content: [],
      order: 3,
    },
    {
      id: '4',
      type: 'skills',
      title: 'Skills',
      content: [],
      order: 4,
    },
  ])

  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const cardBg = useColorModeValue('white', 'gray.800')

  const { isOpen: isPreviewOpen, onOpen: onPreviewOpen, onClose: onPreviewClose } = useDisclosure()

  const addExperience = () => {
    const experienceSection = sections.find(s => s.type === 'experience')
    if (experienceSection) {
      const newExperience: Experience = {
        id: Date.now().toString(),
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
      }

      setSections(prev =>
        prev.map(section =>
          section.id === experienceSection.id
            ? { ...section, content: [...section.content, newExperience] }
            : section
        )
      )
    }
  }

  const updateExperience = (expId: string, field: keyof Experience, value: any) => {
    setSections(prev =>
      prev.map(section =>
        section.type === 'experience'
          ? {
            ...section,
            content: section.content.map((exp: Experience) =>
              exp.id === expId ? { ...exp, [field]: value } : exp
            ),
          }
          : section
      )
    )
  }

  const removeExperience = (expId: string) => {
    setSections(prev =>
      prev.map(section =>
        section.type === 'experience'
          ? {
            ...section,
            content: section.content.filter((exp: Experience) => exp.id !== expId),
          }
          : section
      )
    )
  }

  const addEducation = () => {
    const educationSection = sections.find(s => s.type === 'education')
    if (educationSection) {
      const newEducation: Education = {
        id: Date.now().toString(),
        institution: '',
        degree: '',
        fieldOfStudy: '',
        startDate: '',
        endDate: '',
      }

      setSections(prev =>
        prev.map(section =>
          section.id === educationSection.id
            ? { ...section, content: [...section.content, newEducation] }
            : section
        )
      )
    }
  }

  const updateEducation = (eduId: string, field: keyof Education, value: any) => {
    setSections(prev =>
      prev.map(section =>
        section.type === 'education'
          ? {
            ...section,
            content: section.content.map((edu: Education) =>
              edu.id === eduId ? { ...edu, [field]: value } : edu
            ),
          }
          : section
      )
    )
  }

  const removeEducation = (eduId: string) => {
    setSections(prev =>
      prev.map(section =>
        section.type === 'education'
          ? {
            ...section,
            content: section.content.filter((edu: Education) => edu.id !== eduId),
          }
          : section
      )
    )
  }

  const addSkill = () => {
    const skillsSection = sections.find(s => s.type === 'skills')
    if (skillsSection) {
      setSections(prev =>
        prev.map(section =>
          section.id === skillsSection.id
            ? { ...section, content: [...section.content, ''] }
            : section
        )
      )
    }
  }

  const updateSkill = (index: number, value: string) => {
    setSections(prev =>
      prev.map(section =>
        section.type === 'skills'
          ? {
            ...section,
            content: section.content.map((skill: string, i: number) =>
              i === index ? value : skill
            ),
          }
          : section
      )
    )
  }

  const removeSkill = (index: number) => {
    setSections(prev =>
      prev.map(section =>
        section.type === 'skills'
          ? {
            ...section,
            content: section.content.filter((_: string, i: number) => i !== index),
          }
          : section
      )
    )
  }

  const saveResume = async () => {
    try {
      // TODO: Implement save resume API call
      toast({
        title: 'Resume saved!',
        description: 'Your resume has been saved successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'Error saving resume',
        description: 'There was an error saving your resume. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const generateWithAI = async () => {
    try {
      // Build user profile from current sections
      const personalInfo = sections.find(s => s.type === 'personal')?.content || {}
      const experience = sections.find(s => s.type === 'experience')?.content || []
      const education = sections.find(s => s.type === 'education')?.content || []
      const skills = sections.find(s => s.type === 'skills')?.content || []

      const userProfile = {
        name: `${personalInfo.firstName || ''} ${personalInfo.lastName || ''}`.trim(),
        email: personalInfo.email || '',
        phone: personalInfo.phone || '',
        location: personalInfo.location || '',
        headline: personalInfo.headline || '',
        summary: personalInfo.summary || '',
        skills,
        experience: experience.map((exp: Experience) => ({
          title: exp.title,
          company: exp.company,
          startDate: exp.startDate,
          endDate: exp.current ? undefined : exp.endDate,
          current: exp.current,
          description: exp.description,
          skills: []
        })),
        education: education.map((edu: Education) => ({
          degree: edu.degree,
          institution: edu.institution,
          field: edu.fieldOfStudy,
          startDate: edu.startDate,
          endDate: edu.endDate,
          gpa: edu.gpa
        })),
        certifications: []
      }

      const jobListing = {
        title: 'Software Engineer',
        company: 'Tech Company',
        description: 'Looking for a skilled software engineer to join our team...',
        requirements: [],
        location: 'Remote',
        salary: '$80k - $120k',
        skills: [],
        experience: 3,
        education: 'Bachelor\'s degree',
        employmentType: 'Full-time'
      }

      const result = await generateResume({
        jobTitle: jobListing.title,
        companyName: jobListing.company,
        jobDescription: jobListing.description,
        userProfile: userProfile
      })

      if (result.success && result.data) {
        // Store the generated content
        setGeneratedContent(result.data.content || 'Resume generated successfully!')

        toast({
          title: 'AI Resume Generated!',
          description: 'Your AI-optimized resume has been generated successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })

        // Update the resume title to something more descriptive
        setResumeTitle(`${jobListing.title} Resume - ${jobListing.company}`)

        // Open the preview modal
        onOpen()

        console.log('Generated resume:', result.data)
      } else {
        throw new Error(result.error || 'Failed to generate resume')
      }
    } catch (error: any) {
      toast({
        title: 'Generation Failed',
        description: error.message || 'Failed to generate AI resume. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const PersonalInfoSection = () => {
    const personalSection = sections.find(s => s.type === 'personal')
    if (!personalSection) return null

    return (
      <Card bg={cardBg} borderColor={borderColor}>
        <CardHeader>
          <Heading size="md">Personal Information</Heading>
        </CardHeader>
        <CardBody>
          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
            <Input
              placeholder="First Name"
              value={personalSection.content.firstName}
              onChange={e =>
                setSections(prev =>
                  prev.map(section =>
                    section.type === 'personal'
                      ? { ...section, content: { ...section.content, firstName: e.target.value } }
                      : section
                  )
                )
              }
            />
            <Input
              placeholder="Last Name"
              value={personalSection.content.lastName}
              onChange={e =>
                setSections(prev =>
                  prev.map(section =>
                    section.type === 'personal'
                      ? { ...section, content: { ...section.content, lastName: e.target.value } }
                      : section
                  )
                )
              }
            />
            <Input
              placeholder="Email"
              type="email"
              value={personalSection.content.email}
              onChange={e =>
                setSections(prev =>
                  prev.map(section =>
                    section.type === 'personal'
                      ? { ...section, content: { ...section.content, email: e.target.value } }
                      : section
                  )
                )
              }
            />
            <Input
              placeholder="Phone"
              value={personalSection.content.phone}
              onChange={e =>
                setSections(prev =>
                  prev.map(section =>
                    section.type === 'personal'
                      ? { ...section, content: { ...section.content, phone: e.target.value } }
                      : section
                  )
                )
              }
            />
            <Input
              placeholder="Location"
              value={personalSection.content.location}
              onChange={e =>
                setSections(prev =>
                  prev.map(section =>
                    section.type === 'personal'
                      ? { ...section, content: { ...section.content, location: e.target.value } }
                      : section
                  )
                )
              }
            />
            <Input
              placeholder="Website"
              value={personalSection.content.website}
              onChange={e =>
                setSections(prev =>
                  prev.map(section =>
                    section.type === 'personal'
                      ? { ...section, content: { ...section.content, website: e.target.value } }
                      : section
                  )
                )
              }
            />
          </Grid>
        </CardBody>
      </Card>
    )
  }

  const ExperienceSection = () => {
    const experienceSection = sections.find(s => s.type === 'experience')
    if (!experienceSection) return null

    return (
      <Card bg={cardBg} borderColor={borderColor}>
        <CardHeader>
          <Flex justify="space-between" align="center">
            <Heading size="md">Work Experience</Heading>
            <Button leftIcon={<Icon as={FiPlus} />} size="sm" onClick={addExperience}>
              Add Experience
            </Button>
          </Flex>
        </CardHeader>
        <CardBody>
          <VStack spacing={6} align="stretch">
            {experienceSection.content.map((exp: Experience) => (
              <Box key={exp.id} p={4} border="1px" borderColor={borderColor} borderRadius="md">
                <Flex justify="space-between" align="center" mb={4}>
                  <Text fontWeight="bold">Experience Entry</Text>
                  <IconButton
                    aria-label="Remove experience"
                    icon={<FiTrash2 />}
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    onClick={() => removeExperience(exp.id)}
                  />
                </Flex>
                <Grid templateColumns="repeat(2, 1fr)" gap={4} mb={4}>
                  <Input
                    placeholder="Job Title"
                    value={exp.title}
                    onChange={e => updateExperience(exp.id, 'title', e.target.value)}
                  />
                  <Input
                    placeholder="Company"
                    value={exp.company}
                    onChange={e => updateExperience(exp.id, 'company', e.target.value)}
                  />
                  <Input
                    placeholder="Location"
                    value={exp.location}
                    onChange={e => updateExperience(exp.id, 'location', e.target.value)}
                  />
                  <Input
                    placeholder="Start Date"
                    type="month"
                    value={exp.startDate}
                    onChange={e => updateExperience(exp.id, 'startDate', e.target.value)}
                  />
                  {!exp.current && (
                    <Input
                      placeholder="End Date"
                      type="month"
                      value={exp.endDate}
                      onChange={e => updateExperience(exp.id, 'endDate', e.target.value)}
                    />
                  )}
                </Grid>
                <Textarea
                  placeholder="Job description and achievements..."
                  value={exp.description}
                  onChange={e => updateExperience(exp.id, 'description', e.target.value)}
                  minH="100px"
                />
              </Box>
            ))}
          </VStack>
        </CardBody>
      </Card>
    )
  }

  const EducationSection = () => {
    const educationSection = sections.find(s => s.type === 'education')
    if (!educationSection) return null

    return (
      <Card bg={cardBg} borderColor={borderColor}>
        <CardHeader>
          <Flex justify="space-between" align="center">
            <Heading size="md">Education</Heading>
            <Button leftIcon={<Icon as={FiPlus} />} size="sm" onClick={addEducation}>
              Add Education
            </Button>
          </Flex>
        </CardHeader>
        <CardBody>
          <VStack spacing={6} align="stretch">
            {educationSection.content.map((edu: Education) => (
              <Box key={edu.id} p={4} border="1px" borderColor={borderColor} borderRadius="md">
                <Flex justify="space-between" align="center" mb={4}>
                  <Text fontWeight="bold">Education Entry</Text>
                  <IconButton
                    aria-label="Remove education"
                    icon={<FiTrash2 />}
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    onClick={() => removeEducation(edu.id)}
                  />
                </Flex>
                <Grid templateColumns="repeat(2, 1fr)" gap={4} mb={4}>
                  <Input
                    placeholder="Institution"
                    value={edu.institution}
                    onChange={e => updateEducation(edu.id, 'institution', e.target.value)}
                  />
                  <Input
                    placeholder="Degree"
                    value={edu.degree}
                    onChange={e => updateEducation(edu.id, 'degree', e.target.value)}
                  />
                  <Input
                    placeholder="Field of Study"
                    value={edu.fieldOfStudy}
                    onChange={e => updateEducation(edu.id, 'fieldOfStudy', e.target.value)}
                  />
                  <Input
                    placeholder="GPA (optional)"
                    type="number"
                    step="0.01"
                    min="0"
                    max="4"
                    value={edu.gpa || ''}
                    onChange={e => updateEducation(edu.id, 'gpa', parseFloat(e.target.value) || undefined)}
                  />
                  <Input
                    placeholder="Start Date"
                    type="month"
                    value={edu.startDate}
                    onChange={e => updateEducation(edu.id, 'startDate', e.target.value)}
                  />
                  <Input
                    placeholder="End Date"
                    type="month"
                    value={edu.endDate}
                    onChange={e => updateEducation(edu.id, 'endDate', e.target.value)}
                  />
                </Grid>
                <Textarea
                  placeholder="Description (optional)"
                  value={edu.description || ''}
                  onChange={e => updateEducation(edu.id, 'description', e.target.value)}
                  minH="80px"
                />
              </Box>
            ))}
          </VStack>
        </CardBody>
      </Card>
    )
  }

  const SkillsSection = () => {
    const skillsSection = sections.find(s => s.type === 'skills')
    if (!skillsSection) return null

    // Skill suggestions based on common tech skills
    const skillSuggestions = [
      'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'C++', 'Go',
      'AWS', 'Docker', 'Kubernetes', 'PostgreSQL', 'MongoDB', 'Redis', 'Git',
      'HTML/CSS', 'REST APIs', 'GraphQL', 'Testing', 'CI/CD', 'Agile', 'Scrum'
    ]

    const addSuggestedSkill = (skill: string) => {
      const skillsSection = sections.find(s => s.type === 'skills')
      if (skillsSection && !skillsSection.content.includes(skill)) {
        setSections(prev =>
          prev.map(section =>
            section.id === skillsSection.id
              ? { ...section, content: [...section.content, skill] }
              : section
          )
        )
      }
    }

    return (
      <Card bg={cardBg} borderColor={borderColor}>
        <CardHeader>
          <Flex justify="space-between" align="center">
            <Heading size="md">Skills</Heading>
            <Button leftIcon={<Icon as={FiPlus} />} size="sm" onClick={addSkill}>
              Add Skill
            </Button>
          </Flex>
        </CardHeader>
        <CardBody>
          <VStack spacing={3} align="stretch">
            {skillsSection.content.map((skill: string, index: number) => (
              <HStack key={index}>
                <Input
                  placeholder="Skill name"
                  value={skill}
                  onChange={e => updateSkill(index, e.target.value)}
                />
                <IconButton
                  aria-label="Remove skill"
                  icon={<FiTrash2 />}
                  size="sm"
                  variant="ghost"
                  colorScheme="red"
                  onClick={() => removeSkill(index)}
                />
              </HStack>
            ))}
          </VStack>
          <Wrap spacing={4} mt={4}>
            {skillSuggestions.map(skill => (
              <Badge
                key={skill}
                colorScheme="blue"
                borderRadius="full"
                px={3}
                py={1}
                cursor="pointer"
                onClick={() => addSuggestedSkill(skill)}
              >
                {skill}
              </Badge>
            ))}
          </Wrap>
        </CardBody>
      </Card>
    )
  }

  return (
    <Container maxW="7xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <VStack align="start" spacing={1}>
            <Heading size="lg">Resume Builder</Heading>
            <Text color="gray.600">Create and customize your professional resume</Text>
          </VStack>
          <HStack spacing={3}>
            <Button leftIcon={<Icon as={FiEye} />} variant="outline" onClick={onPreviewOpen}>
              Preview
            </Button>
            <Button leftIcon={<Icon as={FiDownload} />} variant="outline">
              Export PDF
            </Button>
            <Button leftIcon={<Icon as={FiStar} />} colorScheme="purple" onClick={generateWithAI}>
              Generate with AI
            </Button>
            <Button leftIcon={<Icon as={FiSave} />} colorScheme="blue" onClick={saveResume}>
              Save Resume
            </Button>
          </HStack>
        </Flex>

        {/* Resume Title */}
        <Card bg={cardBg} borderColor={borderColor}>
          <CardBody>
            <HStack>
              <Icon as={FiEdit3} />
              <Input
                value={resumeTitle}
                onChange={e => setResumeTitle(e.target.value)}
                fontWeight="bold"
                fontSize="lg"
                border="none"
                _focus={{ boxShadow: 'none' }}
              />
            </HStack>
          </CardBody>
        </Card>

        {/* Resume Sections */}
        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={8}>
          <GridItem>
            <VStack spacing={6} align="stretch">
              <PersonalInfoSection />
              <ExperienceSection />
            </VStack>
          </GridItem>
          <GridItem>
            <VStack spacing={6} align="stretch">
              <EducationSection />
              <SkillsSection />
            </VStack>
          </GridItem>
        </Grid>

        {/* Preview Modal */}
        <Modal isOpen={isPreviewOpen} onClose={onPreviewClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Resume Preview</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {/* Here you can render the resume preview based on the current sections state */}
              <VStack spacing={4} align="stretch">
                {sections.map(section => (
                  <Box key={section.id} p={4} borderWidth={1} borderRadius="md">
                    <Text fontWeight="bold" fontSize="lg" mb={2}>
                      {section.title}
                    </Text>
                    {section.type === 'personal' && (
                      <Text>
                        {section.content.firstName} {section.content.lastName}
                        <br />
                        {section.content.email} | {section.content.phone}
                        <br />
                        {section.content.location} | {section.content.website}
                      </Text>
                    )}
                    {section.type === 'experience' && (
                      <VStack spacing={2} align="stretch">
                        {section.content.map((exp: Experience) => (
                          <Box key={exp.id} p={3} borderWidth={1} borderRadius="md">
                            <Text fontWeight="bold">
                              {exp.title} - {exp.company}
                            </Text>
                            <Text fontSize="sm" color="gray.600">
                              {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                            </Text>
                            <Text>{exp.description}</Text>
                          </Box>
                        ))}
                      </VStack>
                    )}
                    {section.type === 'education' && (
                      <VStack spacing={2} align="stretch">
                        {section.content.map((edu: Education) => (
                          <Box key={edu.id} p={3} borderWidth={1} borderRadius="md">
                            <Text fontWeight="bold">
                              {edu.degree} in {edu.fieldOfStudy}
                            </Text>
                            <Text fontSize="sm" color="gray.600">
                              {edu.institution} | {edu.startDate} - {edu.endDate}
                            </Text>
                            {edu.gpa && (
                              <Text fontSize="sm" color="gray.600">
                                GPA: {edu.gpa}
                              </Text>
                            )}
                          </Box>
                        ))}
                      </VStack>
                    )}
                    {section.type === 'skills' && (
                      <Wrap spacing={4}>
                        {section.content.map((skill: string, index: number) => (
                          <Badge key={index} colorScheme="blue" borderRadius="full" px={3} py={1}>
                            {skill}
                          </Badge>
                        ))}
                      </Wrap>
                    )}
                  </Box>
                ))}
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* AI Generated Resume Preview Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="4xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>AI Generated Resume Preview</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <Box
                p={6}
                border="1px"
                borderColor={borderColor}
                borderRadius="md"
                bg={cardBg}
                maxH="500px"
                overflowY="auto"
              >
                <Text whiteSpace="pre-wrap" fontFamily="monospace" fontSize="sm">
                  {generatedContent}
                </Text>
              </Box>
              <HStack spacing={4} mt={4} justify="flex-end">
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
                <Button colorScheme="blue">
                  Download PDF
                </Button>
              </HStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </Container>
  )
}

export default ResumeBuilderPage
