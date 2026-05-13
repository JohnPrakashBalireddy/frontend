import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import { Role } from '../../../core/models/role.model';

@Component({
  selector: 'app-auth-landing-page',
  templateUrl: './auth-landing-page.component.html',
  styleUrl: './auth-landing-page.component.scss',
  standalone: false
})
export class AuthLandingPageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private toastTimer: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    // If already authenticated, redirect to role home
    if (this.authService.isAuthenticated) {
      this.authService.redirectByRole();
    }
  }

  readonly Role = Role;
  readonly roles = [Role.Customer, Role.Vendor, Role.Admin];
  readonly roleLabels = {
    [Role.Customer]: 'Customer',
    [Role.Vendor]: 'Vendor',
    [Role.Admin]: 'Admin'
  } as Record<Role, string>;

  readonly step = signal<'register' | 'otp'>('register');
  readonly mode = signal<'register' | 'login'>('register');
  readonly loading = signal(false);
  readonly otpSessionId = signal('');
  readonly status = signal('Register and request OTP to continue.');
  readonly toastMsg = signal('');
  readonly selectedRole = signal<Role>(this.authService.selectedRole);

  readonly registerForm = this.fb.nonNullable.group({
    role: this.authService.selectedRole,
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    mobile: ['', [Validators.required, Validators.minLength(10)]],
    city: ['', [Validators.required]],
    shopName: ['']
  });

  readonly otpForm = this.fb.nonNullable.group({
    otp: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(6)]]
  });

  selectRole(role: Role): void {
    this.selectedRole.set(role);
    this.registerForm.patchValue({ role });
    this.authService.setSelectedRole(role);
  }

  setMode(mode: 'register' | 'login') {
    this.mode.set(mode);
    this.step.set('register');
    this.clearToast();
    if (mode === 'login') {
      this.status.set('Login: enter mobile and request OTP to continue.');
    } else {
      this.status.set('Register and request OTP to continue.');
    }
  }

  sendOtp(): void {
    // Validate differently depending on mode: login only requires mobile; register requires full form
    if (this.mode() === 'login') {
      const mobileCtrl = this.registerForm.get('mobile');
      if (!mobileCtrl || mobileCtrl.invalid) {
        this.registerForm.markAllAsTouched();
        this.showToast('Enter a valid mobile number to continue.');
        return;
      }
    } else {
      if (this.registerForm.invalid) {
        this.registerForm.markAllAsTouched();
        this.showToast(this.getRegisterValidationMessage());
        return;
      }
    }

    this.clearToast();
    const value = this.registerForm.getRawValue();
    this.loading.set(true);
    // For login mode, directly request OTP. For register mode, register then request OTP.
    if (this.mode() === 'login') {
      this.authService.requestOtp({ mobile: value.mobile, role: value.role }).subscribe({
        next: (response) => {
          this.otpSessionId.set(response.otpSessionId);
          this.step.set('otp');
          this.status.set(`OTP sent successfully. Session expires at ${response.expiresAt}.`);
          this.clearToast();
          this.loading.set(false);
        },
        error: (error: unknown) => {
          const message = this.resolveErrorMessage(error, 'Unable to send OTP. Try again.');
          this.status.set(message);
          this.showToast(message);
          this.loading.set(false);
        }
      });
    } else {
      this.authService
        .register({
          role: value.role,
          fullName: value.fullName,
          email: value.email,
          mobile: value.mobile,
          city: value.city,
          shopName: value.shopName || undefined
        })
        .subscribe({
          next: () => {
            this.authService.requestOtp({ mobile: value.mobile, role: value.role }).subscribe({
              next: (response) => {
                this.otpSessionId.set(response.otpSessionId);
                this.step.set('otp');
                this.status.set(`OTP sent successfully. Session expires at ${response.expiresAt}.`);
                this.clearToast();
                this.loading.set(false);
              },
              error: (error: unknown) => {
                const message = this.resolveErrorMessage(error, 'Unable to send OTP. Try again.');
                this.status.set(message);
                this.showToast(message);
                this.loading.set(false);
              }
            });
          },
          error: (error: unknown) => {
            const message = this.resolveErrorMessage(error, 'Registration failed. Please try again.');
            this.status.set(message);
            this.showToast(message);
            this.loading.set(false);
          }
        });
    }
  }

  verifyOtp(): void {
    if (this.otpForm.invalid || !this.otpSessionId()) {
      this.otpForm.markAllAsTouched();
      this.showToast(!this.otpSessionId() ? 'Request OTP first, then verify.' : 'Enter a valid OTP to continue.');
      return;
    }

    this.clearToast();
    this.loading.set(true);
    this.authService
      .verifyOtp({
        otpSessionId: this.otpSessionId(),
        otp: this.otpForm.getRawValue().otp
      })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (session) => {
          this.status.set(`Welcome ${session.user.fullName}`);
          this.clearToast();
          this.authService.redirectByRole(session.user.role);
        },
        error: (error: unknown) => {
          const message = this.resolveErrorMessage(error, 'OTP verification failed. Please try again.');
          this.status.set(message);
          this.showToast(message);
        }
      });
  }

  private getRegisterValidationMessage(): string {
    if (this.registerForm.get('fullName')?.invalid) {
      return 'Enter your full name with at least 2 characters.';
    }

    if (this.registerForm.get('email')?.invalid) {
      return 'Enter a valid email address to receive OTP and mail updates.';
    }

    if (this.registerForm.get('mobile')?.invalid) {
      return 'Enter a valid mobile number to continue.';
    }

    if (this.registerForm.get('city')?.invalid) {
      return 'Enter your city to continue.';
    }

    return 'Please fill all required fields correctly.';
  }

  private showToast(message: string): void {
    this.toastMsg.set(message);
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }

    this.toastTimer = setTimeout(() => {
      this.toastMsg.set('');
      this.toastTimer = null;
    }, 3500);
  }

  private clearToast(): void {
    this.toastMsg.set('');
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
      this.toastTimer = null;
    }
  }

  private resolveErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof HttpErrorResponse) {
      const backendError = error.error as { message?: string } | string | null;
      if (typeof backendError === 'string' && backendError.trim()) {
        return backendError;
      }

      if (backendError && typeof backendError === 'object' && backendError.message) {
        return backendError.message;
      }

      if (typeof error.message === 'string' && error.message.trim()) {
        return error.message;
      }

      return fallback;
    }

    if (error instanceof Error && error.message.trim()) {
      return error.message;
    }

    return fallback;
  }
}
