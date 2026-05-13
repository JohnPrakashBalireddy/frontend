import { Component, OnInit, inject } from '@angular/core';
import { ActivityApiService } from '../../../api/activity-api.service';
import { AuthService } from '../../../core/auth/auth.service';
import { ActivityNotification } from '../../../core/models/domain.model';

@Component({
  selector: 'app-admin-profile-page',
  templateUrl: './admin-profile-page.component.html',
  styleUrl: './admin-profile-page.component.scss',
  standalone: false
})
export class AdminProfilePageComponent implements OnInit {
  readonly authService = inject(AuthService);
  private readonly activityApi = inject(ActivityApiService);

  notifications: ActivityNotification[] = [];
  error = '';

  ngOnInit(): void {
    this.activityApi.listAdminNotifications().subscribe({
      next: (notifications) => {
        this.notifications = notifications;
      },
      error: (err) => {
        console.error('Error loading admin notifications:', err);
        this.error = 'Failed to load notifications.';
      }
    });
  }

  onLogout(): void {
    this.authService.logout();
  }
}
