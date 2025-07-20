// LoginPage Types
export interface LoginPageTailwindProps {
  mode?: 'login' | 'register';
};

export interface ValidationErrors {
  [key: string]: string;
};

export interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  suggestions: string[];
};