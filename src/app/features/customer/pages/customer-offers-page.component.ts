import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomerApiService } from '../../../api/customer-api.service';
import { Offer } from '../../../core/models/domain.model';

@Component({
  selector: 'app-customer-offers-page',
  templateUrl: './customer-offers-page.component.html',
  styleUrl: './customer-offers-page.component.scss',
  standalone: false
})
export class CustomerOffersPageComponent implements OnInit {
  constructor(
    private readonly route: ActivatedRoute,
    private readonly customerApi: CustomerApiService
  ) {}

  readonly requirementId = signal('');
  readonly offers = signal<Offer[]>([]);
  readonly acceptedOfferId = signal<string | number | null>(null);
  readonly error = signal('');
  readonly loaded = signal(false);
  readonly actionLoadingId = signal<string | number | null>(null);

  ngOnInit(): void {
    this.requirementId.set(this.route.snapshot.paramMap.get('requirementId') ?? '');
    this.loadOffers(true);
  }

  acceptOffer(offerId: string | number): void {
    this.actionLoadingId.set(offerId);
    this.customerApi.acceptOffer(offerId).subscribe({
      next: (accepted) => {
        if (accepted) {
          this.acceptedOfferId.set(accepted.acceptedOfferId ?? offerId);
        }
        this.actionLoadingId.set(null);
        this.loadOffers(false);
      },
      error: (err) => {
        console.error('Error accepting offer:', err);
        this.error.set('Failed to accept offer');
        this.actionLoadingId.set(null);
      }
    });
  }

  rejectOffer(offerId: string | number): void {
    if (!confirm('Are you sure you want to reject this offer?')) {
      return;
    }
    this.actionLoadingId.set(offerId);
    this.customerApi.rejectOffer(offerId).subscribe({
      next: () => {
        this.actionLoadingId.set(null);
        this.loadOffers(false);
      },
      error: (err) => {
        console.error('Error rejecting offer:', err);
        this.error.set('Failed to reject offer');
        this.actionLoadingId.set(null);
      }
    });
  }

  private loadOffers(resetAcceptedBanner: boolean): void {
    if (!this.requirementId()) {
      return;
    }

    this.error.set('');
    this.loaded.set(false);
    if (resetAcceptedBanner) {
      this.acceptedOfferId.set(null);
    }
    this.customerApi.listOffers(this.requirementId()).subscribe({
      next: (offers) => {
        console.log('Customer offers loaded:', offers);
        this.offers.set(offers);
        this.loaded.set(true);
      },
      error: (err) => {
        console.error('Error loading offers:', err);
        this.error.set('Failed to load offers');
        this.loaded.set(true);
      }
    });
  }

  whatsappLink(mobile?: string): string {
    const digits = (mobile ?? '').replace(/\D/g, '');
    return digits ? `https://wa.me/${digits}` : '#';
  }

  dialLink(mobile?: string): string {
    const digits = (mobile ?? '').replace(/\D/g, '');
    return digits ? `tel:${digits}` : '#';
  }
}
