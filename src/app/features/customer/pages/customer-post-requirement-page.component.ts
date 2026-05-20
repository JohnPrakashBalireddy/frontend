import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerApiService } from '../../../api/customer-api.service';

@Component({
  selector: 'app-customer-post-requirement-page',
  templateUrl: './customer-post-requirement-page.component.html',
  styleUrl: './customer-post-requirement-page.component.scss',
  standalone: false
})
export class CustomerPostRequirementPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly customerApi = inject(CustomerApiService);
  private readonly router = inject(Router);

  step = 1;
  done = false;
  createdRequirementId: string | number | null = null;
  readonly submitting = signal(false);

  readonly form = this.fb.nonNullable.group({
    vehicleType: ['Bike', Validators.required],
    startDate: ['2026-06-05', Validators.required],
    endDate: ['2026-06-07', Validators.required],
    location: ['Anna Nagar, Madurai', Validators.required],
    budgetPerDay: [400, [Validators.required, Validators.min(100)]],
    notes: ['Helmet needed, full tank preferred']
  });

  nextStep(): void {
    this.step = Math.min(this.step + 1, 3);
  }

  previousStep(): void {
    this.step = Math.max(this.step - 1, 1);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const value = this.form.getRawValue();
    this.customerApi
      .postRequirement({
        vehicleType: value.vehicleType,
        startDate: value.startDate,
        endDate: value.endDate,
        location: value.location,
        budgetPerDay: Number(value.budgetPerDay),
        notes: value.notes
      })
      .subscribe({
        next: (created) => {
          this.submitting.set(false);
          this.done = true;
          this.createdRequirementId = created.id;
          setTimeout(() => {
            void this.router.navigate(['/customer']);
          }, 2000);
        },
        error: (err) => {
          console.error('Error posting requirement:', err);
          this.submitting.set(false);
        }
      });
  }

  viewOffers(): void {
    if (!this.createdRequirementId) {
      return;
    }

    void this.router.navigate(['/customer/offers', this.createdRequirementId]);
  }
}
