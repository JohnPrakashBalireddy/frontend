import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivityNotification } from '../core/models/domain.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActivityApiService {
  private readonly baseUrl = `${environment.apiBaseUrl}/api/v1`;

  constructor(private readonly http: HttpClient) {}

  listCustomerNotifications(): Observable<ActivityNotification[]> {
    return this.http.get<ActivityNotification[]>(`${this.baseUrl}/customers/notifications`);
  }

  listVendorNotifications(): Observable<ActivityNotification[]> {
    return this.http.get<ActivityNotification[]>(`${this.baseUrl}/vendors/notifications`);
  }

  listAdminNotifications(): Observable<ActivityNotification[]> {
    return this.http.get<ActivityNotification[]>(`${this.baseUrl}/admin/notifications`);
  }
}
