import { create } from 'zustand';

// Example global state for authentication
interface AuthState {
  user: {
    id: string;
    email: string;
    name?: string;
  } | null;
  isAuthenticated: boolean;
  setUser: (user: AuthState['user']) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));

// Example global state for subscription
interface SubscriptionState {
  plan: string | null;
  trialActive: boolean;
  daysLeftInTrial: number;
  setSubscription: (plan: string, trialActive: boolean, daysLeftInTrial: number) => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  plan: null,
  trialActive: false,
  daysLeftInTrial: 0,
  setSubscription: (plan, trialActive, daysLeftInTrial) => set({ plan, trialActive, daysLeftInTrial }),
}));

// Add more stores as needed for other global state (theme, notifications, etc.)
// Global state for theme (light/dark)
interface ThemeState {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'light',
  setTheme: (theme) => set({ theme }),
  toggleTheme: () => set({ theme: get().theme === 'light' ? 'dark' : 'light' }),
}));

// Global state for notifications
interface Notification {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number; // ms
}

interface NotificationState {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  addNotification: (notification) => set((state) => ({ notifications: [...state.notifications, notification] })),
  removeNotification: (id) => set((state) => ({ notifications: state.notifications.filter((n) => n.id !== id) })),
  clearNotifications: () => set({ notifications: [] }),
}));

// Global state for modals (generic modal manager)
interface ModalState {
  openModal: string | null;
  open: (modalName: string) => void;
  close: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  openModal: null,
  open: (modalName) => set({ openModal: modalName }),
  close: () => set({ openModal: null }),
}));

// Global state for user preferences
interface UserPreferencesState {
  language: string;
  darkMode: boolean;
  emailNotifications: boolean;
  setLanguage: (language: string) => void;
  setDarkMode: (darkMode: boolean) => void;
  setEmailNotifications: (enabled: boolean) => void;
}

export const useUserPreferencesStore = create<UserPreferencesState>((set) => ({
  language: 'en',
  darkMode: false,
  emailNotifications: true,
  setLanguage: (language) => set({ language }),
  setDarkMode: (darkMode) => set({ darkMode }),
  setEmailNotifications: (enabled) => set({ emailNotifications: enabled }),
}));

// Global state for loading/spinner
interface LoadingState {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
}));

// Global state for sidebar/menu
interface MenuState {
  isSidebarOpen: boolean;
  isMobileMenuOpen: boolean;
  isUserMenuOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  setUserMenuOpen: (open: boolean) => void;
}

export const useMenuStore = create<MenuState>((set) => ({
  isSidebarOpen: true,
  isMobileMenuOpen: false,
  isUserMenuOpen: false,
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  setUserMenuOpen: (open) => set({ isUserMenuOpen: open }),
}));

// Global state for widget (e.g., floating widget)
interface WidgetState {
  isMinimized: boolean;
  isDragging: boolean;
  position: { x: number; y: number };
  isVisible: boolean;
  setMinimized: (minimized: boolean) => void;
  setDragging: (dragging: boolean) => void;
  setPosition: (position: { x: number; y: number }) => void;
  setVisible: (visible: boolean) => void;
}

export const useWidgetStore = create<WidgetState>((set) => ({
  isMinimized: false,
  isDragging: false,
  position: { x: 20, y: 20 },
  isVisible: true,
  setMinimized: (minimized) => set({ isMinimized: minimized }),
  setDragging: (dragging) => set({ isDragging: dragging }),
  setPosition: (position) => set({ position }),
  setVisible: (visible) => set({ isVisible: visible }),
}));

// Global state for error handling
interface ErrorState {
  error: string | null;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useErrorStore = create<ErrorState>((set) => ({
  error: null,
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));
