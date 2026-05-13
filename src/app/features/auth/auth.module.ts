import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthLandingPageComponent } from './pages/auth-landing-page.component';

@NgModule({
  declarations: [AuthLandingPageComponent],
  imports: [CommonModule, SharedModule, ReactiveFormsModule, AuthRoutingModule]
})
export class AuthModule {}
