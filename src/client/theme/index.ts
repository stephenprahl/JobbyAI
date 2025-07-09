import { extendTheme } from '@chakra-ui/react'

const colors = {
  brand: {
    50: '#e8f4ff',
    100: '#bee3ff',
    200: '#87ceeb',
    300: '#4db8ff',
    400: '#26a5ff',
    500: '#0091ff',
    600: '#0081e6',
    700: '#006bcc',
    800: '#0055b3',
    900: '#003d99',
  },
  accent: {
    50: '#fff0f5',
    100: '#ffd1dc',
    200: '#ffb3c6',
    300: '#ff8fa3',
    400: '#ff6b8a',
    500: '#ff4757',
    600: '#ff3742',
    700: '#e6222d',
    800: '#cc1e29',
    900: '#b31a24',
  },
  purple: {
    50: '#f3e8ff',
    100: '#e9d5ff',
    200: '#ddd6fe',
    300: '#c4b5fd',
    400: '#a78bfa',
    500: '#8b5cf6',
    600: '#7c3aed',
    700: '#6d28d9',
    800: '#5b21b6',
    900: '#4c1d95',
  },
  green: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  },
  orange: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
}

const fonts = {
  heading: `'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
  body: `'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
}

const components = {
  Button: {
    defaultProps: {
      colorScheme: 'brand',
    },
    variants: {
      solid: (props: any) => ({
        bg: props.colorScheme === 'brand' ? 'brand.500' : undefined,
        color: 'white',
        _hover: {
          bg: props.colorScheme === 'brand' ? 'brand.600' : undefined,
          transform: 'translateY(-1px)',
          boxShadow: 'lg',
        },
        transition: 'all 0.2s',
      }),
      outline: (props: any) => ({
        border: '2px solid',
        borderColor: props.colorScheme === 'brand' ? 'brand.500' : undefined,
        color: props.colorScheme === 'brand' ? 'brand.500' : undefined,
        _hover: {
          bg: props.colorScheme === 'brand' ? 'brand.500' : undefined,
          color: props.colorScheme === 'brand' ? 'white' : undefined,
          transform: 'translateY(-1px)',
          boxShadow: 'lg',
        },
        transition: 'all 0.2s',
      }),
      ghost: (props: any) => ({
        color: props.colorScheme === 'brand' ? 'brand.400' : undefined,
        _hover: {
          bg: props.colorScheme === 'brand' ? 'brand.50' : undefined,
          _dark: {
            bg: props.colorScheme === 'brand' ? 'brand.900' : undefined,
          },
        },
      }),
    },
  },
  Card: {
    baseStyle: {
      container: {
        bg: 'white',
        borderRadius: 'xl',
        boxShadow: 'xl',
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'gray.200',
        _dark: {
          bg: 'gray.800',
          borderColor: 'gray.700',
        },
      },
    },
  },
  Box: {
    variants: {
      gradient: {
        bgGradient: 'linear(135deg, brand.500, purple.500, accent.500)',
      },
    },
  },
}

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

const theme = extendTheme({
  colors,
  fonts,
  components,
  config,
  styles: {
    global: (props: any) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.900' : 'gray.50',
        color: props.colorMode === 'dark' ? 'white' : 'gray.900',
      },
      '*::placeholder': {
        color: props.colorMode === 'dark' ? 'gray.400' : 'gray.500',
      },
      '*, *::before, &::after': {
        borderColor: props.colorMode === 'dark' ? 'gray.700' : 'gray.200',
      },
    }),
  },
})

export default theme
