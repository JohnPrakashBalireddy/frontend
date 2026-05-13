import { Component, Input } from '@angular/core';
import { ActivityNotification } from '../../../core/models/domain.model';

@Component({
  selector: 'app-mail-inbox',
  templateUrl: './mail-inbox.component.html',
  styleUrl: './mail-inbox.component.scss',
  standalone: false
})
export class MailInboxComponent {
  @Input() heading = 'Mail inbox';
  @Input() title = 'Notifications and email updates';
  @Input() subtitle = 'Recent actions that triggered mail or in-app alerts';
  @Input() emptyTitle = 'No notifications yet';
  @Input() emptyMessage = 'Triggered emails and activity updates will appear here.';
  @Input() notifications: ActivityNotification[] = [];

  get unreadCount(): number {
    return this.notifications.filter((item) => item.read === false).length;
  }

  get totalCount(): number {
    return this.notifications.length;
  }

  get itemLabel(): string {
    return this.totalCount === 1 ? 'item' : 'items';
  }

  displayTitle(notification: ActivityNotification): string {
    return notification.title?.trim() || this.fallbackTitle(notification.type);
  }

  displayType(notification: ActivityNotification): string | null {
    if (!notification.type) {
      return null;
    }

    return notification.type
      .split(/[_-]/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ');
  }

  displayInitial(notification: ActivityNotification): string {
    const title = this.displayTitle(notification);
    return title.charAt(0).toUpperCase();
  }

  private fallbackTitle(type?: string): string {
    if (!type) {
      return 'Mail update';
    }

    const normalized = type.replace(/[_-]/g, ' ').trim();
    return normalized ? `${normalized.charAt(0).toUpperCase()}${normalized.slice(1)}` : 'Mail update';
  }
}