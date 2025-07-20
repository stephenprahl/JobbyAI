export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  limits: {
    resumeGenerations: number | null;
    jobAnalyses: number | null;
    templates: number | null;
    aiAnalyses: number | null;
  };
  popular?: boolean;
}

export interface PaymentMethod {
  id: string;
  type: string;
  cardLast4: string;
  cardBrand: string;
  cardExpMonth: number;
  cardExpYear: number;
  cardHolderName?: string;
  billingAddress?: any;
  isDefault: boolean;
  createdAt: string;
}

export interface Subscription {
  id: string;
  plan: string;
  status: string;
  trialEnd?: string;
  currentPeriodEnd?: string;
  isTrialActive: boolean;
  daysLeftInTrial: number;
  planDetails: Plan;
  usageRecords: Array<{
    feature: string;
    usage: number;
    limit: number | null;
  }>;
}

export interface CardDetails {
  number: string;
  expMonth: number;
  expYear: number;
  cvc: string;
  holderName?: string;
}

export interface BillingAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}