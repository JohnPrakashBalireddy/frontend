import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerApiService } from '../../../api/customer-api.service';
import { AuthService } from '../../../core/auth/auth.service';
import { Requirement } from '../../../core/models/domain.model';

@Component({
  selector: 'app-customer-home-page',
  templateUrl: './customer-home-page.component.html',
  styleUrl: './customer-home-page.component.scss',
  standalone: false
})
export class CustomerHomePageComponent implements OnInit {
  private readonly customerApi = inject(CustomerApiService);
  private readonly router = inject(Router);
  readonly authService = inject(AuthService);

  readonly requirements = signal<Requirement[]>([]);
  readonly activeCount = computed(() => this.requirements().filter((r) => r.status === 'live').length);
  readonly error = signal('');
  readonly loading = signal(true);

  ngOnInit(): void {
    this.loading.set(true);
    this.customerApi.listRequirements().subscribe({
      next: (requirements) => {
        console.log('Customer requirements loaded:', requirements);
        this.requirements.set(requirements);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading requirements:', err);
        this.error.set('Failed to load requirements');
        this.loading.set(false);
      }
    });
  }

  goToPost(): void {
    void this.router.navigateByUrl('/customer/post');
  }

  openOffers(requirementId: string | number): void {
    void this.router.navigate(['/customer/offers', requirementId]);
  }

  handleCardClick(requirement: Requirement): void {
    if (requirement.status === 'live' || requirement.status === 'accepted') {
      this.openOffers(requirement.id);
    }
  }
}
