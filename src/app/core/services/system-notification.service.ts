import { Injectable } from '@angular/core';
import { timer, Subscription, switchMap } from 'rxjs';
import { ActivityApiService } from '../../api/activity-api.service';
import { AuthService } from '../auth/auth.service';
import { ActivityNotification } from '../models/domain.model';
import { Role } from '../models/role.model';

@Injectable({
  providedIn: 'root'
})
export class SystemNotificationService {
  private pollingSubscription: Subscription | null = null;
  private readonly seenNotificationIds = new Set<string>();

  constructor(
    private readonly authService: AuthService,
    private readonly activityApi: ActivityApiService
  ) {}

  start(): void {
    this.authService.session$.subscribe((session) => {
      this.stopPolling();

      if (!session?.user?.role) {
        return;
      }

      void this.ensurePermission();
      this.pollingSubscription = timer(0, 15000)
        .pipe(switchMap(() => this.fetchNotifications(session.user.role)))
        .subscribe((notifications) => {
          this.showNewNotifications(notifications);
        });
    });
  }

  private fetchNotifications(role: Role) {
    if (role === Role.Vendor) {
      return this.activityApi.listVendorNotifications();
    }

    if (role === Role.Admin) {
      return this.activityApi.listAdminNotifications();
    }

    return this.activityApi.listCustomerNotifications();
  }

  private showNewNotifications(notifications: ActivityNotification[]): void {
    for (const notification of notifications) {
      if (notification.read) {
        continue;
      }

      const key = String(notification.id);
      if (this.seenNotificationIds.has(key)) {
        continue;
      }

      this.seenNotificationIds.add(key);
      this.showSystemNotification(notification);
    }
  }

  private showSystemNotification(notification: ActivityNotification): void {
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') {
      return;
    }

    const systemNotification = new Notification(notification.title ?? 'RideOnDemand', {
      body: notification.message,
      tag: String(notification.id)
    });

    systemNotification.onclick = () => {
      window.focus();
      systemNotification.close();
    };
  }

  private async ensurePermission(): Promise<void> {
    if (typeof Notification === 'undefined' || Notification.permission !== 'default') {
      return;
    }

    try {
      await Notification.requestPermission();
    } catch {
      // Ignore permission failures; in-app notifications still continue.
    }
  }

  private stopPolling(): void {
    this.pollingSubscription?.unsubscribe();
    this.pollingSubscription = null;
    this.seenNotificationIds.clear();
  }
}
