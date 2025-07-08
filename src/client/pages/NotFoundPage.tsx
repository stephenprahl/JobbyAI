import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
} from '@chakra-ui/react'
import React from 'react'
import { FiArrowLeft, FiHome } from 'react-icons/fi'
import { Link as RouterLink } from 'react-router-dom'

const NotFoundPage: React.FC = () => {
  return (
    <Box minH="100vh" bg="gray.50" display="flex" alignItems="center">
      <Container maxW="md">
        <VStack spacing={8} textAlign="center">
          {/* 404 Illustration */}
          <Box>
            <Text fontSize="8xl" fontWeight="bold" color="brand.500" lineHeight="1">
              404
            </Text>
          </Box>

          {/* Content */}
          <VStack spacing={4}>
            <Heading as="h1" size="xl">
              Page Not Found
            </Heading>
            <Text color="gray.600" fontSize="lg" maxW="md">
              Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or you might have entered the wrong URL.
            </Text>
          </VStack>

          {/* Actions */}
          <VStack spacing={4}>
            <Button
              as={RouterLink}
              to="/"
              leftIcon={<FiHome />}
              colorScheme="brand"
              size="lg"
            >
              Go Home
            </Button>
            <Button
              leftIcon={<FiArrowLeft />}
              variant="outline"
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
          </VStack>
        </VStack>
      </Container>
    </Box>
  )
}

export default NotFoundPage
