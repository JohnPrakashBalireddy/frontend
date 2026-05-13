import { Component, OnInit, inject } from '@angular/core';
import { CustomerApiService } from '../../../api/customer-api.service';
import { AuthService } from '../../../core/auth/auth.service';
import { ActivityNotification } from '../../../core/models/domain.model';

@Component({
  selector: 'app-customer-profile-page',
  templateUrl: './customer-profile-page.component.html',
  styleUrl: './customer-profile-page.component.scss',
  standalone: false
})
export class CustomerProfilePageComponent implements OnInit {
  readonly authService = inject(AuthService);
  private readonly customerApi = inject(CustomerApiService);

  notifications: ActivityNotification[] = [];
  error = '';

  ngOnInit(): void {
    this.customerApi.listNotifications().subscribe({
      next: (notifications) => {
        this.notifications = notifications;
      },
      error: (err) => {
        console.error('Error loading customer notifications:', err);
        this.error = 'Failed to load notifications.';
      }
    });
  }

  onLogout(): void {
    this.authService.logout();
  }
}
