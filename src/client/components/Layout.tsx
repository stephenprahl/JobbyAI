import {
  Avatar,
  Box,
  Button,
  Container,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack,
} from '@chakra-ui/react'
import React from 'react'
import { FiBriefcase, FiFileText, FiLogOut, FiMenu, FiSettings, FiUser } from 'react-icons/fi'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const { isOpen, onOpen, onClose } = useDisclosure()

  // Theme colors
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const mainBg = useColorModeValue('gray.50', 'gray.900')

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: FiUser, color: 'brand' },
    { name: 'Profile', href: '/profile', icon: FiUser, color: 'purple' },
    { name: 'Resume Builder', href: '/resume/builder', icon: FiFileText, color: 'green' },
    { name: 'My Resumes', href: '/resume', icon: FiFileText, color: 'orange' },
    { name: 'Job Analysis', href: '/jobs', icon: FiBriefcase, color: 'accent' },
  ]

  const NavLink: React.FC<{
    href: string;
    children: React.ReactNode;
    icon?: any;
    color?: string
  }> = ({ href, children, icon: Icon, color = 'brand' }) => {
    const isActive = location.pathname === href
    return (
      <Button
        as={RouterLink}
        to={href}
        variant={isActive ? 'solid' : 'ghost'}
        colorScheme={isActive ? color : 'gray'}
        leftIcon={Icon ? <Icon /> : undefined}
        justifyContent="flex-start"
        w="full"
        _hover={{
          transform: 'translateY(-1px)',
          boxShadow: 'lg',
        }}
        transition="all 0.2s"
      >
        {children}
      </Button>
    )
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <Box minH="100vh" bg={mainBg}>
      {/* Header with gradient background */}
      <Box
        bg={bgColor}
        boxShadow="xl"
        borderBottom="1px"
        borderColor={borderColor}
        position="relative"
        _before={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          bgGradient: 'linear(to-r, brand.500, purple.500, accent.500, green.500, orange.500)',
        }}
      >
        <Container maxW="7xl">
          <Flex h={16} alignItems="center" justifyContent="space-between">
            {/* Logo */}
            <HStack spacing={4}>
              <IconButton
                display={{ base: 'flex', md: 'none' }}
                onClick={onOpen}
                variant="outline"
                aria-label="Open menu"
                icon={<FiMenu />}
                colorScheme="brand"
              />
              <Box>
                <Text
                  fontSize="xl"
                  fontWeight="bold"
                  bgGradient="linear(to-r, brand.400, purple.400)"
                  bgClip="text"
                >
                  Resume Plan AI
                </Text>
              </Box>
            </HStack>

            {/* Desktop Navigation */}
            <HStack spacing={2} display={{ base: 'none', md: 'flex' }}>
              {navigation.map((item) => (
                <Button
                  key={item.name}
                  as={RouterLink}
                  to={item.href}
                  variant={location.pathname === item.href ? 'solid' : 'ghost'}
                  colorScheme={location.pathname === item.href ? item.color : 'gray'}
                  leftIcon={<item.icon />}
                  size="sm"
                  _hover={{
                    transform: 'translateY(-1px)',
                    boxShadow: 'lg',
                  }}
                  transition="all 0.2s"
                >
                  {item.name}
                </Button>
              ))}
            </HStack>

            {/* User Menu */}
            <Menu>
              <MenuButton>
                <Avatar
                  size="sm"
                  name={user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.email}
                  cursor="pointer"
                />
              </MenuButton>
              <MenuList>
                <MenuItem as={RouterLink} to="/profile" icon={<FiUser />}>
                  Profile
                </MenuItem>
                <MenuItem icon={<FiSettings />}>Settings</MenuItem>
                <MenuDivider />
                <MenuItem icon={<FiLogOut />} onClick={handleLogout}>
                  Sign out
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Container>
      </Box>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg={bgColor}>
          <DrawerCloseButton />
          <DrawerHeader>
            <Text
              bgGradient="linear(to-r, brand.400, purple.400)"
              bgClip="text"
              fontWeight="bold"
            >
              Resume Plan AI
            </Text>
          </DrawerHeader>
          <DrawerBody>
            <VStack spacing={2} align="stretch">
              {navigation.map((item) => (
                <NavLink key={item.name} href={item.href} icon={item.icon} color={item.color}>
                  {item.name}
                </NavLink>
              ))}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Main Content */}
      <Container maxW="7xl" py={8}>
        {children}
      </Container>
    </Box>
  )
}

export default Layout
