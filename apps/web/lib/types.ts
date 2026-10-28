export type UserRole = 'PATIENT' | 'ADMIN' | 'LAB_PARTNER' | 'COLLECTOR';

export interface UserSession {
  id: string;
  name: string;
  email?: string;
  phone: string;
  role: UserRole;
  labId?: string;
  collectorId?: string;
}

export interface TestCategory {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  sortOrder: number;
}

export interface TestItem {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  category?: TestCategory;
  labPrice?: number; // Kept internal for admin/lab
  sellingPrice: number; // Customer price
  sampleType: string;
  fastingRequired: boolean;
  fastingDurationHours: number;
  preparationNotes?: string;
  turnaroundHours: number;
  description: string;
  popular: boolean;
  active: boolean;
}

export interface LabReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  locality?: string;
  verified: boolean;
}

export interface PartnerLab {
  id: string;
  name: string;
  slug: string;
  area: string;
  city: string;
  pincode: string;
  distanceKm: number;
  turnaroundText: string;
  turnaroundHours?: number;
  partnerStatus: string;
  rating: number;
  totalReviews: number;
  accreditations: string[]; // e.g. ['NABL Accredited', 'ISO 9001:2015', 'CAP Certified', 'ICMR Approved']
  recentReviews: LabReview[];
  sampleReviewSnippet?: string;
  tagline?: string;
  phone: string;
  email: string;
  address: string;
  frontImageUrl?: string;
  insideImageUrl?: string;
  equipmentImageUrl?: string;
  active: boolean;
}

export interface LabTestOffer {
  labId: string;
  lab: PartnerLab;
  testId: string;
  testName: string;
  offerPrice: number;
  mrp: number;
  discountPercent: number;
  distanceKm: number;
  turnaroundText: string;
  turnaroundHours: number;
  rating: number;
  totalReviews: number;
  accreditations: string[];
  isBestPrice?: boolean;
  isNearest?: boolean;
  isTopRated?: boolean;
  isFastest?: boolean;
  sampleReviewSnippet?: string;
}

export interface HealthPackageItem {
  id: string;
  name: string;
  slug: string;
  labPrice?: number;
  sellingPrice: number;
  description: string;
  popular: boolean;
  active: boolean;
  includedTestsSummary: string;
}

export type BookingStatus =
  | 'BOOKING_RECEIVED'
  | 'LAB_CONFIRMED'
  | 'COLLECTOR_ASSIGNED'
  | 'COLLECTION_SCHEDULED'
  | 'SAMPLE_COLLECTED'
  | 'SAMPLE_RECEIVED_AT_LAB'
  | 'TESTING_IN_PROGRESS'
  | 'REPORT_READY'
  | 'REPORT_DELIVERED'
  | 'CANCELLED';

export interface BookingDetails {
  id: string;
  bookingNumber: string;
  userId?: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  patientPhone: string;
  patientEmail?: string;
  house: string;
  street: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  
  labId: string;
  laboratory?: PartnerLab;
  collectorId?: string;
  collector?: {
    id: string;
    name: string;
    phone: string;
    area: string;
  };
  
  scheduledDate: string;
  timeSlot: string;
  fastingWindow?: string;
  
  totalAmount: number;
  labBaseAmount?: number;
  grossMargin?: number;
  status: BookingStatus;
  paymentStatus: 'PENDING' | 'PAID' | 'CASH_ON_COLLECTION';
  
  referralCode?: string;
  referralEarned?: number;
  consentAgreed: boolean;
  notes?: string;
  createdAt: string;
  
  items?: Array<{
    id: string;
    itemName: string;
    itemType: 'TEST' | 'PACKAGE';
    price: number;
  }>;
}

export interface ReportParameter {
  parameter: string;
  value: string;
  unit: string;
  normalRange: string;
  status: 'Normal' | 'High' | 'Low' | 'Borderline High' | 'Borderline Low';
}

export interface DigitalReport {
  id: string;
  bookingId: string;
  bookingNumber?: string;
  patientName?: string;
  patientAge?: number;
  patientGender?: string;
  testName: string;
  fileUrl?: string;
  findings: ReportParameter[];
  summary: string;
  isNormal: boolean;
  doctorName: string;
  labName: string;
  uploadedAt: string;
  isDelivered: boolean;
}

export interface ReferralPartnerSummary {
  id: string;
  name: string;
  type: string;
  code: string;
  phone: string;
  email?: string;
  active: boolean;
  totalEarnings: number;
  paidEarnings: number;
  pendingEarnings: number;
}
