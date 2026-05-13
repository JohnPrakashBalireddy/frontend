import { Component, OnInit, inject } from '@angular/core';
import { SystemNotificationService } from './core/services/system-notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss'
})
export class App {
  private readonly systemNotificationService = inject(SystemNotificationService);

  ngOnInit(): void {
    this.systemNotificationService.start();
  }
}
