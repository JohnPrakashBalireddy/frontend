import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardPageComponent } from './pages/admin-dashboard-page.component';
import { AdminProfilePageComponent } from './pages/admin-profile-page.component';

const routes: Routes = [
  { path: '', component: AdminDashboardPageComponent },
  { path: 'profile', component: AdminProfilePageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
