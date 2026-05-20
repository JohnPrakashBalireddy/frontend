import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize, switchMap } from 'rxjs';
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

  readonly mode = signal<'register' | 'login'>('register');
  readonly loading = signal(false);
  readonly status = signal('Register with password to continue.');
  readonly toastMsg = signal('');
  readonly selectedRole = signal<Role>(this.authService.selectedRole);

  readonly registerForm = this.fb.nonNullable.group({
    role: this.authService.selectedRole,
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    mobile: ['', [Validators.required, Validators.minLength(10)]],
    city: ['', [Validators.required]],
    shopName: ['']
  });

  readonly loginForm = this.fb.nonNullable.group({
    role: this.authService.selectedRole,
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  selectRole(role: Role): void {
    this.selectedRole.set(role);
    this.registerForm.patchValue({ role });
    this.loginForm.patchValue({ role });
    this.authService.setSelectedRole(role);
  }

  setMode(mode: 'register' | 'login') {
    this.mode.set(mode);
    this.clearToast();
    if (mode === 'login') {
      this.status.set('Login with email and password to continue.');
    } else {
      this.status.set('Register with password to continue.');
    }
  }

  submitAuth(): void {
    if (this.mode() === 'login') {
      if (this.loginForm.invalid) {
        this.loginForm.markAllAsTouched();
        this.showToast(this.getLoginValidationMessage());
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
    this.loading.set(true);

    if (this.mode() === 'login') {
      const value = this.loginForm.getRawValue();
      this.authService
        .login({
          role: value.role,
          email: value.email,
          password: value.password
        })
        .pipe(finalize(() => this.loading.set(false)))
        .subscribe({
          next: (session) => {
            this.status.set(`Welcome ${session.user.fullName}`);
            this.clearToast();
            this.authService.redirectByRole(session.user.role);
          },
          error: (error: unknown) => {
            const message = this.resolveErrorMessage(error, 'Login failed. Please check your credentials.');
            this.status.set(message);
            this.showToast(message);
          }
        });
    } else {
      const value = this.registerForm.getRawValue();
      this.authService
        .register({
          role: value.role,
          fullName: value.fullName,
          email: value.email,
          password: value.password,
          mobile: value.mobile,
          city: value.city,
          shopName: value.shopName || undefined
        })
        .pipe(
          switchMap(() =>
            this.authService.login({
              role: value.role,
              email: value.email,
              password: value.password
            })
          ),
          finalize(() => this.loading.set(false))
        )
        .subscribe({
          next: (session) => {
            this.status.set(`Welcome ${session.user.fullName}`);
            this.clearToast();
            this.authService.redirectByRole(session.user.role);
          },
          error: (error: unknown) => {
            const message = this.resolveErrorMessage(error, 'Registration failed. Please try again.');
            this.status.set(message);
            this.showToast(message);
          }
        });
    }
  }

  private getLoginValidationMessage(): string {
    if (this.loginForm.get('email')?.invalid) {
      return 'Enter a valid email address to continue.';
    }

    if (this.loginForm.get('password')?.invalid) {
      return 'Enter your password to continue.';
    }

    return 'Please fill all required fields correctly.';
  }

  private getRegisterValidationMessage(): string {
    if (this.registerForm.get('fullName')?.invalid) {
      return 'Enter your full name with at least 2 characters.';
    }

    if (this.registerForm.get('email')?.invalid) {
      return 'Enter a valid email address to continue.';
    }

    if (this.registerForm.get('password')?.invalid) {
      return 'Password must be at least 8 characters.';
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
