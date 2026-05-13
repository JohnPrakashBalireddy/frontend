import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerHomePageComponent } from './pages/customer-home-page.component';
import { CustomerPostRequirementPageComponent } from './pages/customer-post-requirement-page.component';
import { CustomerOffersPageComponent } from './pages/customer-offers-page.component';

import { CustomerProfilePageComponent } from './pages/customer-profile-page.component';

const routes: Routes = [
  { path: '', component: CustomerHomePageComponent },
  { path: 'post', component: CustomerPostRequirementPageComponent },
  { path: 'offers/:requirementId', component: CustomerOffersPageComponent },
  { path: 'profile', component: CustomerProfilePageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule {}
