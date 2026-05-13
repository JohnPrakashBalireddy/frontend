import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardPageComponent } from './pages/admin-dashboard-page.component';
import { AdminProfilePageComponent } from './pages/admin-profile-page.component';

@NgModule({
  declarations: [AdminDashboardPageComponent, AdminProfilePageComponent],
  imports: [CommonModule, SharedModule, AdminRoutingModule]
})
export class AdminModule {}
