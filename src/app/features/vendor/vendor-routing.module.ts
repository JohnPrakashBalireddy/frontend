import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VendorDashboardPageComponent } from './pages/vendor-dashboard-page.component';
import { VendorApprovalRequiredPageComponent } from './pages/vendor-approval-required-page.component';
import { VendorProfilePageComponent } from './pages/vendor-profile-page.component';

const routes: Routes = [
  { path: '', component: VendorDashboardPageComponent },
  { path: 'profile', component: VendorProfilePageComponent },
  { path: 'approval-required', component: VendorApprovalRequiredPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorRoutingModule {}
