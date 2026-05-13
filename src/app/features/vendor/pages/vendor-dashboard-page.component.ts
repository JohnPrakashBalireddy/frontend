import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { VendorApiService } from '../../../api/vendor-api.service';
import { Offer, Requirement } from '../../../core/models/domain.model';

@Component({
  selector: 'app-vendor-dashboard-page',
  templateUrl: './vendor-dashboard-page.component.html',
  styleUrl: './vendor-dashboard-page.component.scss',
  standalone: false
})
export class VendorDashboardPageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly vendorApi = inject(VendorApiService);

  readonly demandFeed = signal<Requirement[]>([]);
  readonly myOffers = signal<Offer[]>([]);
  readonly selectedRequirement = signal<Requirement | null>(null);
  readonly error = signal('');

  readonly offerForm = this.fb.nonNullable.group({
    pricePerDay: [350, [Validators.required, Validators.min(100)]],
    vehicleModel: ['Royal Enfield Classic', Validators.required],
    registrationNumber: ['TN 39 1234', Validators.required],
    notes: ['Helmet included, full tank']
  });

  ngOnInit(): void {
    this.loadData();
  }

  chooseRequirement(requirement: Requirement): void {
    this.selectedRequirement.set(requirement);
  }

  submitOffer(): void {
    if (!this.selectedRequirement() || this.offerForm.invalid) {
      return;
    }

    const value = this.offerForm.getRawValue();
    this.vendorApi
      .submitOffer({
        requirementId: this.selectedRequirement()!.id,
        pricePerDay: Number(value.pricePerDay),
        vehicleModel: value.vehicleModel,
        registrationNumber: value.registrationNumber,
        notes: value.notes
      })
      .subscribe({
        next: () => {
          this.selectedRequirement.set(null);
          this.loadData();
        },
        error: (err) => {
          console.error('Error submitting offer:', err);
          this.error.set('Failed to submit offer');
        }
      });
  }

  private loadData(): void {
    this.error.set('');
    
    this.vendorApi.listDemandFeed().subscribe({
      next: (feed) => {
        console.log('Demand feed loaded:', feed);
        this.demandFeed.set(feed);
      },
      error: (err) => {
        if (this.redirectIfApprovalRequired(err)) {
          return;
        }
        console.error('Error loading demand feed:', err);
        this.error.set('Failed to load demand feed');
      }
    });

    this.vendorApi.listVendorOffers().subscribe({
      next: (offers) => {
        console.log('Vendor offers loaded:', offers);
        this.myOffers.set(offers);
      },
      error: (err) => {
        if (this.redirectIfApprovalRequired(err)) {
          return;
        }
        console.error('Error loading vendor offers:', err);
        this.error.set('Failed to load vendor offers');
      }
    });
  }

  private redirectIfApprovalRequired(err: unknown): boolean {
    const status = (err as { status?: number })?.status;
    const backendMessage = (err as { error?: { message?: string } })?.error?.message ?? '';

    if (status === 403 && backendMessage.toLowerCase().includes('vendor approval is required')) {
      void this.router.navigate(['/vendor/approval-required']);
      return true;
    }

    return false;
  }
}
