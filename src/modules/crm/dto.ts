export interface CustomerProfileDto {
  id: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  role: string;
  createdAt: Date;
  profile?: {
    id: string;
    preferredLanguage: string;
    favoriteTableId: string | null;
    averageSpend: number;
    lastVisit: Date | null;
    totalVisits: number;
    lifetimeValue: number;
    birthday: Date | null;
    anniversary: Date | null;
    marketingConsent: boolean;
    tags: string[];
    internalNotes: string | null;
    manualSegment: string | null;
  } | null;
  segment?: string;
  churnRisk?: string;
  orders?: {
    id: string;
    totalAmount: number;
    createdAt: Date;
    status: string;
  }[];
}
