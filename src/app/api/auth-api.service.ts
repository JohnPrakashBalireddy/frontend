import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import {
  OtpRequestResponse,
  RegisterPayload,
  RequestOtpPayload,
  User,
  UserSession,
  VerifyOtpPayload
} from '../core/models/auth.model';
import { Role } from '../core/models/role.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  private readonly baseUrl = `${environment.apiBaseUrl}/api/v1`;

  constructor(private readonly http: HttpClient) {}

  register(payload: RegisterPayload): Observable<User> {
    return this.http
      .post<BackendUser>(`${this.baseUrl}/auth/register`, {
        ...payload,
        role: toBackendRole(payload.role)
      })
      .pipe(map((user) => mapUser(user)));
  }

  requestOtp(payload: RequestOtpPayload): Observable<OtpRequestResponse> {
    return this.http.post<OtpRequestResponse>(`${this.baseUrl}/auth/request-otp`, {
      ...payload,
      role: toBackendRole(payload.role)
    });
  }

  verifyOtp(payload: VerifyOtpPayload): Observable<UserSession> {
    return this.http
      .post<VerifyOtpResponse>(`${this.baseUrl}/auth/verify-otp`, payload)
      .pipe(
        map((response) => ({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          user: mapUser(response.user)
        }))
      );
  }

  me(): Observable<User> {
    return this.http.get<BackendUser>(`${this.baseUrl}/auth/me`).pipe(map((user) => mapUser(user)));
  }


}

interface BackendUser {
  id: string | number;
  fullName: string;
  email?: string;
  mobile: string;
  city: string;
  shopName?: string | null;
  role: 'CUSTOMER' | 'VENDOR' | 'ADMIN';
  vendorApprovalStatus?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'NOT_REQUIRED';
  createdAt?: string;
  updatedAt?: string;
}

interface VerifyOtpResponse {
  accessToken: string;
  refreshToken?: string;
  user: BackendUser;
}

function toBackendRole(role: Role): 'CUSTOMER' | 'VENDOR' | 'ADMIN' {
  switch (role) {
    case Role.Customer:
      return 'CUSTOMER';
    case Role.Vendor:
      return 'VENDOR';
    case Role.Admin:
      return 'ADMIN';
  }
}

function mapUser(user: BackendUser): User {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email ?? undefined,
    mobile: user.mobile,
    city: user.city,
    role: fromBackendRole(user.role),
    shopName: user.shopName ?? undefined,
    vendorApprovalStatus: user.vendorApprovalStatus,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

function fromBackendRole(role: 'CUSTOMER' | 'VENDOR' | 'ADMIN'): Role {
  switch (role) {
    case 'CUSTOMER':
      return Role.Customer;
    case 'VENDOR':
      return Role.Vendor;
    case 'ADMIN':
      return Role.Admin;
  }
}
