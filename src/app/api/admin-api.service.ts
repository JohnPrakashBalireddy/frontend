import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { AdminStats } from '../core/models/domain.model';
import { User } from '../core/models/auth.model';
import { environment } from '../../environments/environment';
import { Role } from '../core/models/role.model';

@Injectable({
  providedIn: 'root'
})
export class AdminApiService {
  private readonly baseUrl = `${environment.apiBaseUrl}/api/v1/admin`;

  constructor(private readonly http: HttpClient) {}

  getDashboardStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(`${this.baseUrl}/dashboard/stats`);
  }

  listPendingApprovals(): Observable<User[]> {
    return this.http.get<BackendUser[]>(`${this.baseUrl}/vendors/pending-approvals`).pipe(
      map((users) => users.map((user) => mapUser(user)))
    );
  }

  approveVendor(vendorId: string | number): Observable<User> {
    return this.http
      .post<BackendUser>(`${this.baseUrl}/vendors/${vendorId}/approve`, {})
      .pipe(map((user) => mapUser(user)));
  }

  rejectVendor(vendorId: string | number): Observable<User> {
    return this.http
      .post<BackendUser>(`${this.baseUrl}/vendors/${vendorId}/reject`, {})
      .pipe(map((user) => mapUser(user)));
  }
}

interface BackendUser {
  id: string | number;
  fullName: string;
  mobile: string;
  city: string;
  shopName?: string | null;
  role?: 'CUSTOMER' | 'VENDOR' | 'ADMIN';
  vendorApprovalStatus?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'NOT_REQUIRED';
  createdAt?: string;
  updatedAt?: string;
}

function mapUser(user: BackendUser): User {
  return {
    id: user.id,
    fullName: user.fullName,
    mobile: user.mobile,
    city: user.city,
    role: mapRole(user.role),
    shopName: user.shopName ?? undefined,
    vendorApprovalStatus: user.vendorApprovalStatus,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

function mapRole(role?: BackendUser['role']): Role {
  if (role === 'VENDOR') {
    return Role.Vendor;
  }

  if (role === 'ADMIN') {
    return Role.Admin;
  }

  return Role.Customer;
}
