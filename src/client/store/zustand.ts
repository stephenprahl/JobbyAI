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
