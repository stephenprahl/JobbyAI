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

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: FiUser },
    { name: 'Profile', href: '/profile', icon: FiUser },
    { name: 'Resume Builder', href: '/resume', icon: FiFileText },
    { name: 'Job Analysis', href: '/jobs', icon: FiBriefcase },
  ]

  const NavLink: React.FC<{ href: string; children: React.ReactNode; icon?: any }> = ({
    href,
    children,
    icon: Icon,
  }) => {
    const isActive = location.pathname === href
    return (
      <Button
        as={RouterLink}
        to={href}
        variant={isActive ? 'solid' : 'ghost'}
        colorScheme={isActive ? 'brand' : 'gray'}
        leftIcon={Icon ? <Icon /> : undefined}
        justifyContent="flex-start"
        w="full"
      >
        {children}
      </Button>
    )
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Header */}
      <Box bg="white" boxShadow="sm" borderBottom="1px" borderColor="gray.200">
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
              />
              <Text fontSize="xl" fontWeight="bold" color="brand.500">
                Resume Plan AI
              </Text>
            </HStack>

            {/* Desktop Navigation */}
            <HStack spacing={4} display={{ base: 'none', md: 'flex' }}>
              {navigation.map((item) => (
                <Button
                  key={item.name}
                  as={RouterLink}
                  to={item.href}
                  variant={location.pathname === item.href ? 'solid' : 'ghost'}
                  colorScheme={location.pathname === item.href ? 'brand' : 'gray'}
                  leftIcon={<item.icon />}
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
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Resume Plan AI</DrawerHeader>
          <DrawerBody>
            <VStack spacing={2} align="stretch">
              {navigation.map((item) => (
                <NavLink key={item.name} href={item.href} icon={item.icon}>
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
