import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { VendorRoutingModule } from './vendor-routing.module';
import { VendorDashboardPageComponent } from './pages/vendor-dashboard-page.component';
import { VendorApprovalRequiredPageComponent } from './pages/vendor-approval-required-page.component';
import { VendorProfilePageComponent } from './pages/vendor-profile-page.component';

@NgModule({
  declarations: [VendorDashboardPageComponent, VendorApprovalRequiredPageComponent, VendorProfilePageComponent],
  imports: [CommonModule, SharedModule, ReactiveFormsModule, VendorRoutingModule]
})
export class VendorModule {}
