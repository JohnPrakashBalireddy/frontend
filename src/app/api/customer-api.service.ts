import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ActivityNotification, Offer, Requirement } from '../core/models/domain.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerApiService {
  private readonly baseUrl = `${environment.apiBaseUrl}/api/v1/customers`;

  constructor(private readonly http: HttpClient) {}

  listRequirements(): Observable<Requirement[]> {
    return this.http
      .get<BackendRequirement[]>(`${this.baseUrl}/requirements`)
      .pipe(map((items) => items.map((item) => mapRequirement(item))));
  }

  postRequirement(payload: Omit<Requirement, 'id' | 'status' | 'customerId' | 'customerName'>): Observable<Requirement> {
    return this.http
      .post<BackendRequirement>(`${this.baseUrl}/requirements`, payload)
      .pipe(map((item) => mapRequirement(item)));
  }

  listOffers(requirementId: string | number): Observable<Offer[]> {
    return this.http
      .get<BackendOffer[]>(`${this.baseUrl}/requirements/${requirementId}/offers`)
      .pipe(map((items) => items.map((item) => mapOffer(item))));
  }

  acceptOffer(offerId: string | number): Observable<Requirement> {
    return this.http
      .post<BackendRequirement>(`${this.baseUrl}/offers/${offerId}/accept`, {})
      .pipe(map((item) => mapRequirement(item)));
  }

  listNotifications(): Observable<ActivityNotification[]> {
    return this.http.get<BackendNotification[]>(`${this.baseUrl}/notifications`).pipe(
      map((items) =>
        items.map((item) => ({
          id: item.id,
          title: item.title,
          type: item.type,
          message: item.message,
          read: item.read,
          createdAt: item.createdAt
        }))
      )
    );
  }
}

interface BackendRequirement {
  id: string | number;
  vehicleType: string;
  startDate: string;
  endDate: string;
  location: string;
  budgetPerDay: number;
  notes?: string;
  status: 'OPEN' | 'ACCEPTED' | 'COMPLETED';
  acceptedOfferId?: string | number | null;
  createdAt?: string;
}

interface BackendOffer {
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
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt?: string;
}

interface BackendNotification {
  id: string | number;
  type: string;
  title?: string;
  message: string;
  read: boolean;
  createdAt: string;
}

function mapRequirement(item: BackendRequirement): Requirement {
  return {
    id: item.id,
    vehicleType: item.vehicleType,
    startDate: item.startDate,
    endDate: item.endDate,
    location: item.location,
    budgetPerDay: item.budgetPerDay,
    notes: item.notes,
    acceptedOfferId: item.acceptedOfferId,
    createdAt: item.createdAt,
    status: mapRequirementStatus(item.status)
  };
}

function mapOffer(item: BackendOffer): Offer {
  return {
    id: item.id,
    requirementId: item.requirementId,
    vendorId: item.vendorId,
    vendorName: item.vendorName,
    vendorMobile: item.vendorMobile,
    vendorAddress: item.vendorAddress,
    pricePerDay: item.pricePerDay,
    vehicleModel: item.vehicleModel,
    registrationNumber: item.registrationNumber,
    notes: item.notes,
    createdAt: item.createdAt,
    status: mapOfferStatus(item.status)
  };
}

function mapRequirementStatus(status: BackendRequirement['status']): Requirement['status'] {
  if (status === 'ACCEPTED') {
    return 'accepted';
  }

  if (status === 'COMPLETED') {
    return 'completed';
  }

  return 'live';
}

function mapOfferStatus(status: BackendOffer['status']): Offer['status'] {
  if (status === 'ACCEPTED') {
    return 'accepted';
  }

  if (status === 'REJECTED') {
    return 'rejected';
  }

  return 'pending';
}
