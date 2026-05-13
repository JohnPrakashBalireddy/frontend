import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerHomePageComponent } from './pages/customer-home-page.component';
import { CustomerOffersPageComponent } from './pages/customer-offers-page.component';
import { CustomerPostRequirementPageComponent } from './pages/customer-post-requirement-page.component';
import { CustomerProfilePageComponent } from './pages/customer-profile-page.component';

@NgModule({
  declarations: [
    CustomerHomePageComponent,
    CustomerPostRequirementPageComponent,
    CustomerOffersPageComponent,
    CustomerProfilePageComponent
  ],
  imports: [CommonModule, SharedModule, ReactiveFormsModule, CustomerRoutingModule]
})
export class CustomerModule {}
