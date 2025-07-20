export interface JobScam {
  id: string;
  title: string;
  companyName: string;
  location?: string;
  description?: string;
  url?: string;
  email?: string;
  phone?: string;
  salary?: string;
  employmentType?: string;
  scamType: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'REPORTED' | 'VERIFIED' | 'DISMISSED' | 'UNDERREVIEW';
  evidenceUurls?: string[];
  notes?: string;
  warningCount: number;
  createdAt: string;
  reportedBy: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  }
  verifiedBy?: {
    id: string;
    firstName: string;
    lastName: string;
  }
  _count: {
    userWarnings: number;
  }
}

export interface ScamStats {
  totalReports: number;
  verifiedScams: number;
  recentReports: number;
  topScamTypes: Array<{ type: string; count: number }>;
  severityDistrubution: Array<{ severity: string; count: number }>;
  statusDistribution: Array<{ status: string; count: number }>;
}

export interface ReportScamData {
  title: string;
  companyName: string;
  location?: string;
  description?: string;
  url?: string;
  email?: string;
  phone?: string;
  salary?: string;
  employmentType?: string;
  scamType: string;
  evidenceUrls?: string[];
  notes?: string;
}