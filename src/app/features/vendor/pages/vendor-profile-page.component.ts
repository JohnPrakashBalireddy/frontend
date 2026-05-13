import { Component, OnInit, inject } from '@angular/core';
import { ActivityApiService } from '../../../api/activity-api.service';
import { AuthService } from '../../../core/auth/auth.service';
import { ActivityNotification } from '../../../core/models/domain.model';

@Component({
  selector: 'app-vendor-profile-page',
  templateUrl: './vendor-profile-page.component.html',
  styleUrl: './vendor-profile-page.component.scss',
  standalone: false
})
export class VendorProfilePageComponent implements OnInit {
  readonly authService = inject(AuthService);
  private readonly activityApi = inject(ActivityApiService);

  notifications: ActivityNotification[] = [];
  error = '';

  ngOnInit(): void {
    this.activityApi.listVendorNotifications().subscribe({
      next: (notifications) => {
        this.notifications = notifications;
      },
      error: (err) => {
        console.error('Error loading vendor notifications:', err);
        this.error = 'Failed to load notifications.';
      }
    });
  }

  onLogout(): void {
    this.authService.logout();
  }
}
