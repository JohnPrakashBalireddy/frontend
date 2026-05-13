import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Offer, PagedResponse, Requirement } from '../core/models/domain.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VendorApiService {
  private readonly baseUrl = `${environment.apiBaseUrl}/api/v1/vendors`;

  constructor(private readonly http: HttpClient) {}

  listDemandFeed(params?: { vehicleType?: string; location?: string; page?: number; size?: number }): Observable<Requirement[]> {
    const queryParams: any = {
      page: String(params?.page ?? 0),
      size: String(params?.size ?? 20)
    };
    if (params?.vehicleType) {
      queryParams.vehicleType = params.vehicleType;
    }
    if (params?.location) {
      queryParams.location = params.location;
    }
    return this.http
      .get<PagedResponse<BackendRequirement>>(`${this.baseUrl}/demand-feed`, { params: queryParams })
      .pipe(map((response) => response.content.map((item) => mapRequirement(item))));
  }

  submitOffer(payload: Omit<Offer, 'id' | 'status' | 'vendorId' | 'vendorName'>): Observable<Offer> {
    return this.http
      .post<BackendOffer>(`${this.baseUrl}/offers`, payload)
      .pipe(map((item) => mapOffer(item)));
  }

  listVendorOffers(params?: { status?: 'pending' | 'accepted' | 'rejected'; page?: number; size?: number }): Observable<Offer[]> {
    const queryParams: any = {
      page: String(params?.page ?? 0),
      size: String(params?.size ?? 20)
    };
    if (params?.status) {
      queryParams.status = mapOfferStatusToBackend(params.status);
    }
    return this.http
      .get<PagedResponse<BackendOffer>>(`${this.baseUrl}/offers`, { params: queryParams })
      .pipe(map((response) => response.content.map((item) => mapOffer(item))));
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
  pricePerDay: number;
  vehicleModel: string;
  registrationNumber: string;
  notes?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt?: string;
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
    status: item.status === 'ACCEPTED' ? 'accepted' : item.status === 'COMPLETED' ? 'completed' : 'live'
  };
}

function mapOffer(item: BackendOffer): Offer {
  return {
    id: item.id,
    requirementId: item.requirementId,
    vendorId: item.vendorId,
    vendorName: item.vendorName,
    pricePerDay: item.pricePerDay,
    vehicleModel: item.vehicleModel,
    registrationNumber: item.registrationNumber,
    notes: item.notes,
    createdAt: item.createdAt,
    status: item.status === 'ACCEPTED' ? 'accepted' : item.status === 'REJECTED' ? 'rejected' : 'pending'
  };
}

function mapOfferStatusToBackend(status: 'pending' | 'accepted' | 'rejected'): 'PENDING' | 'ACCEPTED' | 'REJECTED' {
  if (status === 'accepted') {
    return 'ACCEPTED';
  }

  if (status === 'rejected') {
    return 'REJECTED';
  }

  return 'PENDING';
}
