export interface Requirement {
  id: string | number;
  customerId?: string | number;
  customerName?: string;
  vehicleType: string;
  startDate: string;
  endDate: string;
  location: string;
  budgetPerDay: number;
  notes?: string;
  acceptedOfferId?: string | number | null;
  createdAt?: string;
  status: 'live' | 'accepted' | 'completed';
}

export interface Offer {
  id: string | number;
  requirementId: string | number;
  vendorId: string | number;
  vendorName: string;
  vendorMobile?: string;
  vendorAddress?: string;
  pricePerDay: number;
  vehicleModel: string;
  registrationNumber: string;
  notes?: string;
  createdAt?: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface ActivityNotification {
  id: string | number;
  userId?: string | number;
  type?: string;
  title?: string;
  message: string;
  read?: boolean;
  createdAt: string;
}

export interface AdminStats {
  activeRequirements: number;
  offersToday: number;
  dealsThisWeek: number;
  verifiedShops: number;
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
