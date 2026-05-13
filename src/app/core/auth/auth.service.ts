import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { AuthApiService } from '../../api/auth-api.service';
import {
  OtpRequestResponse,
  RegisterPayload,
  RequestOtpPayload,
  User,
  UserSession,
  VerifyOtpPayload
} from '../models/auth.model';
import { Role } from '../models/role.model';

const SESSION_STORAGE_KEY = 'rod-session';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly sessionSubject = new BehaviorSubject<UserSession | null>(this.loadFromStorage());
  private selectedRoleSubject = new BehaviorSubject<Role>(Role.Customer);

  readonly session$ = this.sessionSubject.asObservable();
  readonly user$ = this.session$.pipe(map((session) => session?.user ?? null));

  constructor(
    private readonly authApi: AuthApiService,
    private readonly router: Router
  ) {}

  get selectedRole(): Role {
    return this.selectedRoleSubject.value;
  }

  get sessionSnapshot(): UserSession | null {
    return this.sessionSubject.value;
  }

  get isAuthenticated(): boolean {
    return !!this.sessionSnapshot;
  }

  setSelectedRole(role: Role): void {
    this.selectedRoleSubject.next(role);
  }

  register(payload: RegisterPayload): Observable<User> {
    return this.authApi.register(payload);
  }

  requestOtp(payload: RequestOtpPayload): Observable<OtpRequestResponse> {
    return this.authApi.requestOtp(payload);
  }

  verifyOtp(payload: VerifyOtpPayload): Observable<UserSession> {
    return this.authApi.verifyOtp(payload).pipe(
      tap((session) => {
        this.sessionSubject.next(session);
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      })
    );
  }

  updateSessionUser(user: User): void {
    const currentSession = this.sessionSnapshot;

    if (!currentSession) {
      return;
    }

    const updatedSession: UserSession = {
      ...currentSession,
      user
    };

    this.sessionSubject.next(updatedSession);
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updatedSession));
  }

  logout(): void {
    this.sessionSubject.next(null);
    localStorage.removeItem(SESSION_STORAGE_KEY);
    void this.router.navigate(['/auth']);
  }

  redirectByRole(role?: Role): void {
    const currentRole = role ?? this.sessionSnapshot?.user.role;
    if (!currentRole) {
      void this.router.navigate(['/auth']);
      return;
    }

    void this.router.navigate([`/${currentRole}`]);
  }

  private loadFromStorage(): UserSession | null {
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as UserSession) : null;
    } catch {
      return null;
    }
  }
}
