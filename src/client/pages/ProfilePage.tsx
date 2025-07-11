import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  SimpleGrid,
  Spacer,
  Spinner,
  Text,
  Textarea,
  useToast,
  VStack,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FiEdit, FiPlus, FiSave, FiTrash2, FiX } from 'react-icons/fi'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useAuth } from '../contexts/AuthContext'
import { getCurrentUser, getUserSkills, updateUserProfile } from '../services/api'

const ProfilePage: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const toast = useToast()
  const queryClient = useQueryClient()

  // Fetch user profile data
  const { data: userProfile, isLoading: profileLoading } = useQuery(
    ['user-profile'],
    () => getCurrentUser(),
    {
      enabled: !!user,
      onError: (error) => {
        console.error('Error fetching user profile:', error)
        toast({
          title: 'Error',
          description: 'Failed to load profile data',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      }
    }
  )

  // Fetch user skills
  const { data: userSkills, isLoading: skillsLoading } = useQuery(
    ['user-skills'],
    () => getUserSkills(),
    {
      enabled: !!user,
      onError: (error) => {
        console.error('Error fetching skills:', error)
      }
    }
  )

  // Update profile mutation
  const updateProfileMutation = useMutation(
    (updates: any) => updateUserProfile(updates),
    {
      onSuccess: () => {
        toast({
          title: 'Profile updated',
          description: 'Your profile has been successfully updated.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
        setIsEditing(false)
        queryClient.invalidateQueries(['user-profile'])
      },
      onError: (error) => {
        console.error('Error updating profile:', error)
        toast({
          title: 'Error',
          description: 'Failed to update profile',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      }
    }
  )

  const { register, handleSubmit, reset } = useForm()

  // Set form defaults when profile data loads
  useEffect(() => {
    if (userProfile?.data?.profile) {
      reset({
        headline: userProfile.data.profile.headline || '',
        summary: userProfile.data.profile.summary || '',
        location: userProfile.data.profile.location || '',
        websiteUrl: userProfile.data.profile.websiteUrl || '',
        linkedinUrl: userProfile.data.profile.linkedinUrl || '',
        githubUrl: userProfile.data.profile.githubUrl || '',
      })
    }
  }, [userProfile, reset])

  const onSubmit = async (data: any) => {
    updateProfileMutation.mutate({
      profile: {
        headline: data.headline,
        summary: data.summary,
        location: data.location,
        websiteUrl: data.websiteUrl,
        linkedinUrl: data.linkedinUrl,
        githubUrl: data.githubUrl,
      }
    })
  }

  const handleCancel = () => {
    if (userProfile?.data?.profile) {
      reset({
        headline: userProfile.data.profile.headline || '',
        summary: userProfile.data.profile.summary || '',
        location: userProfile.data.profile.location || '',
        websiteUrl: userProfile.data.profile.websiteUrl || '',
        linkedinUrl: userProfile.data.profile.linkedinUrl || '',
        githubUrl: userProfile.data.profile.githubUrl || '',
      })
    }
    setIsEditing(false)
  }

  if (authLoading || profileLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="60vh">
        <Spinner size="xl" />
      </Box>
    )
  }

  const profile = userProfile?.data?.profile
  const skills = userSkills?.data || []
  const experiences = userProfile?.data?.experiences || []

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'EXPERT': return 'green'
      case 'ADVANCED': return 'blue'
      case 'INTERMEDIATE': return 'yellow'
      case 'BEGINNER': return 'red'
      default: return 'gray'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    })
  }

  return (
    <VStack spacing={8} align="stretch">
      {/* Header */}
      <Flex align="center">
        <VStack align="start" spacing={1}>
          <Heading as="h1" size="xl">
            Profile
          </Heading>
          <Text color="gray.600">
            Manage your personal information and skills
          </Text>
        </VStack>
        <Spacer />
        <Avatar
          size="lg"
          name={user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.email}
        />
      </Flex>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <Flex align="center">
            <Heading as="h2" size="md">
              Basic Information
            </Heading>
            <Spacer />
            {!isEditing ? (
              <Button leftIcon={<FiEdit />} onClick={() => setIsEditing(true)} variant="outline">
                Edit
              </Button>
            ) : (
              <HStack>
                <Button leftIcon={<FiSave />} onClick={handleSubmit(onSubmit)} colorScheme="brand">
                  Save
                </Button>
                <Button leftIcon={<FiX />} onClick={handleCancel} variant="outline">
                  Cancel
                </Button>
              </HStack>
            )}
          </Flex>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FormControl>
                <FormLabel>First Name</FormLabel>
                <Input defaultValue={user?.firstName} isReadOnly={!isEditing} />
              </FormControl>
              <FormControl>
                <FormLabel>Last Name</FormLabel>
                <Input defaultValue={user?.lastName} isReadOnly={!isEditing} />
              </FormControl>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input defaultValue={user?.email} isReadOnly />
              </FormControl>
              <FormControl>
                <FormLabel>Location</FormLabel>
                <Input {...register('location')} isReadOnly={!isEditing} />
              </FormControl>
            </SimpleGrid>

            <VStack spacing={4} mt={4}>
              <FormControl>
                <FormLabel>Professional Headline</FormLabel>
                <Input {...register('headline')} isReadOnly={!isEditing} />
              </FormControl>
              <FormControl>
                <FormLabel>Professional Summary</FormLabel>
                <Textarea {...register('summary')} isReadOnly={!isEditing} rows={4} />
              </FormControl>
            </VStack>

            <Divider my={4} />

            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Website URL</FormLabel>
                <Input {...register('websiteUrl')} isReadOnly={!isEditing} />
              </FormControl>
              <FormControl>
                <FormLabel>LinkedIn URL</FormLabel>
                <Input {...register('linkedinUrl')} isReadOnly={!isEditing} />
              </FormControl>
              <FormControl>
                <FormLabel>GitHub URL</FormLabel>
                <Input {...register('githubUrl')} isReadOnly={!isEditing} />
              </FormControl>
            </VStack>
          </form>
        </CardBody>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <Flex align="center">
            <Heading as="h2" size="md">
              Skills
            </Heading>
            <Spacer />
            <Button leftIcon={<FiPlus />} variant="outline" size="sm">
              Add Skill
            </Button>
          </Flex>
        </CardHeader>
        <CardBody>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {skills.map((skill) => (
              <Box key={skill.skillId} p={4} border="1px" borderColor="gray.200" borderRadius="md">
                <Flex align="center" justify="space-between">
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="semibold">{skill.name}</Text>
                    <HStack>
                      <Badge colorScheme={getLevelColor(skill.level)} variant="subtle">
                        {skill.level}
                      </Badge>
                      <Text fontSize="sm" color="gray.600">
                        {skill.yearsOfExperience} years
                      </Text>
                    </HStack>
                  </VStack>
                  <HStack>
                    <IconButton
                      aria-label="Edit skill"
                      icon={<FiEdit />}
                      size="sm"
                      variant="outline"
                    />
                    <IconButton
                      aria-label="Delete skill"
                      icon={<FiTrash2 />}
                      size="sm"
                      variant="outline"
                      colorScheme="red"
                    />
                  </HStack>
                </Flex>
              </Box>
            ))}
          </SimpleGrid>
        </CardBody>
      </Card>

      {/* Experience */}
      <Card>
        <CardHeader>
          <Flex align="center">
            <Heading as="h2" size="md">
              Work Experience
            </Heading>
            <Spacer />
            <Button leftIcon={<FiPlus />} variant="outline" size="sm">
              Add Experience
            </Button>
          </Flex>
        </CardHeader>
        <CardBody>
          <VStack spacing={6} align="stretch">
            {experiences.map((exp, index) => (
              <Box key={exp.id}>
                <Flex align="start" justify="space-between">
                  <VStack align="start" spacing={2} flex={1}>
                    <Heading as="h3" size="sm">
                      {exp.title}
                    </Heading>
                    <Text color="gray.600" fontSize="sm">
                      {exp.companyName} • {exp.location}
                    </Text>
                    <Text color="gray.600" fontSize="sm">
                      {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate!)}
                      {exp.current && <Badge ml={2} colorScheme="green" variant="subtle">Current</Badge>}
                    </Text>
                    <Text fontSize="sm">{exp.description}</Text>
                  </VStack>
                  <HStack>
                    <IconButton
                      aria-label="Edit experience"
                      icon={<FiEdit />}
                      size="sm"
                      variant="outline"
                    />
                    <IconButton
                      aria-label="Delete experience"
                      icon={<FiTrash2 />}
                      size="sm"
                      variant="outline"
                      colorScheme="red"
                    />
                  </HStack>
                </Flex>
                {index < experiences.length - 1 && <Divider mt={4} />}
              </Box>
            ))}
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  )
}

export default ProfilePage
