import { Role } from './role.model';

export type VendorApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'NOT_REQUIRED';

export interface User {
  id: string | number;
  fullName: string;
  email?: string;
  mobile: string;
  city: string;
  role: Role;
  shopName?: string;
  vendorApprovalStatus?: VendorApprovalStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserSession {
  accessToken: string;
  refreshToken?: string;
  user: User;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  mobile: string;
  city: string;
  role: Role;
  shopName?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  role: Role;
}


