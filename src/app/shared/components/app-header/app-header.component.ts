import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { Role } from '../../../core/models/role.model';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.scss',
  standalone: false
})
export class AppHeaderComponent {
  @Input() title = 'RideOnDemand';
  @Input() subtitle = '';

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  get user() {
    return this.authService.sessionSnapshot?.user;
  }

  goToProfile(): void {
    const user = this.authService.sessionSnapshot?.user;
    if (!user) {
      return;
    }

    if (user.role === Role.Vendor) {
      void this.router.navigateByUrl('/vendor/profile');
    } else if (user.role === Role.Admin) {
      void this.router.navigateByUrl('/admin/profile');
    } else {
      void this.router.navigateByUrl('/customer/profile');
    }
  }
}
