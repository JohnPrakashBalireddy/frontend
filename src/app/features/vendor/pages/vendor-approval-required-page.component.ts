import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-vendor-approval-required-page',
  templateUrl: './vendor-approval-required-page.component.html',
  styleUrl: './vendor-approval-required-page.component.scss',
  standalone: false
})
export class VendorApprovalRequiredPageComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  goToDashboard(): void {
    void this.router.navigate(['/vendor']);
  }

  signOut(): void {
    this.authService.logout();
  }
}
