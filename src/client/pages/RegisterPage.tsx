import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  SimpleGrid,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { RegisterRequest } from '../types'

const RegisterPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterRequest & { confirmPassword: string }>()

  const password = watch('password')

  const onSubmit = async (data: RegisterRequest & { confirmPassword: string }) => {
    setIsLoading(true)
    setError(null)

    try {
      const { confirmPassword, ...registerData } = data
      await registerUser(registerData)
      toast({
        title: 'Account created!',
        description: 'Welcome to Resume Plan AI. Your account has been created successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create account. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box minH="100vh" bg="gray.50" py={12}>
      <Container maxW="md">
        <VStack spacing={8}>
          {/* Header */}
          <VStack spacing={2} textAlign="center">
            <Text fontSize="xl" fontWeight="bold" color="brand.500">
              Resume Plan AI
            </Text>
            <Heading as="h1" size="lg">
              Create your account
            </Heading>
            <Text color="gray.600">
              Join thousands of professionals who have improved their job search.
            </Text>
          </VStack>

          {/* Register Form */}
          <Card w="full" variant="outline">
            <CardHeader>
              <Heading as="h2" size="md" textAlign="center">
                Sign Up
              </Heading>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleSubmit(onSubmit)}>
                <VStack spacing={4}>
                  {error && (
                    <Alert status="error">
                      <AlertIcon />
                      {error}
                    </Alert>
                  )}

                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
                    <FormControl isInvalid={!!errors.firstName}>
                      <FormLabel>First name</FormLabel>
                      <Input
                        type="text"
                        placeholder="John"
                        {...register('firstName', {
                          minLength: {
                            value: 2,
                            message: 'First name must be at least 2 characters',
                          },
                        })}
                      />
                      {errors.firstName && (
                        <Text color="red.500" fontSize="sm" mt={1}>
                          {errors.firstName.message}
                        </Text>
                      )}
                    </FormControl>

                    <FormControl isInvalid={!!errors.lastName}>
                      <FormLabel>Last name</FormLabel>
                      <Input
                        type="text"
                        placeholder="Doe"
                        {...register('lastName', {
                          minLength: {
                            value: 2,
                            message: 'Last name must be at least 2 characters',
                          },
                        })}
                      />
                      {errors.lastName && (
                        <Text color="red.500" fontSize="sm" mt={1}>
                          {errors.lastName.message}
                        </Text>
                      )}
                    </FormControl>
                  </SimpleGrid>

                  <FormControl isInvalid={!!errors.email}>
                    <FormLabel>Email address</FormLabel>
                    <Input
                      type="email"
                      placeholder="john.doe@example.com"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address',
                        },
                      })}
                    />
                    {errors.email && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {errors.email.message}
                      </Text>
                    )}
                  </FormControl>

                  <FormControl isInvalid={!!errors.password}>
                    <FormLabel>Password</FormLabel>
                    <Input
                      type="password"
                      placeholder="Create a strong password"
                      {...register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 8,
                          message: 'Password must be at least 8 characters',
                        },
                        pattern: {
                          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                          message: 'Password must contain uppercase, lowercase, number, and special character',
                        },
                      })}
                    />
                    {errors.password && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {errors.password.message}
                      </Text>
                    )}
                  </FormControl>

                  <FormControl isInvalid={!!errors.confirmPassword}>
                    <FormLabel>Confirm password</FormLabel>
                    <Input
                      type="password"
                      placeholder="Confirm your password"
                      {...register('confirmPassword', {
                        required: 'Please confirm your password',
                        validate: (value) => value === password || 'Passwords do not match',
                      })}
                    />
                    {errors.confirmPassword && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {errors.confirmPassword.message}
                      </Text>
                    )}
                  </FormControl>

                  <Button
                    type="submit"
                    colorScheme="brand"
                    size="lg"
                    w="full"
                    isLoading={isLoading}
                    loadingText="Creating account..."
                  >
                    Create Account
                  </Button>

                  <Divider />

                  <Text fontSize="sm" color="gray.600" textAlign="center">
                    By creating an account, you agree to our{' '}
                    <Link color="brand.500">Terms of Service</Link> and{' '}
                    <Link color="brand.500">Privacy Policy</Link>.
                  </Text>
                </VStack>
              </form>
            </CardBody>
          </Card>

          {/* Sign in link */}
          <Card w="full" variant="outline">
            <CardBody textAlign="center">
              <Text>
                Already have an account?{' '}
                <Link as={RouterLink} to="/login" color="brand.500" fontWeight="semibold">
                  Sign in
                </Link>
              </Text>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  )
}

export default RegisterPage
