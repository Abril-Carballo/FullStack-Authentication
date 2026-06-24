import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse, LoginDto, RegisterDto } from '../models/auth';
import { SafeUser } from '../models/user';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = `${environment.apiUrl}/auth`;
  private readonly tokenKey = 'access_token';

  user = signal<SafeUser | null>(null);

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    const token = this.getToken();
    if (token) {
      this.me().subscribe();
    }
  }

  // lo cambie para que cuando registres un usuario te lleve a una pestania de 'Revisá tu email'
  register(dto: RegisterDto): Observable<{ id: string; email: string; role: string; isVerified: boolean }> {
    // App plantas: registra al usuario pero no inicia sesión automáticamente porque debe verificar su email
    return this.http.post<{ id: string; email: string; role: string; isVerified: boolean }>(
      `${this.api}/register`,
      dto,
    );
  }

  login(dto: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.api}/login`, dto).pipe(
      tap((res) => this.handleAuth(res)),
    );
  }

  verifyEmail(token: string): Observable<{ message: string }> {
    // App plantas: envía al backend el token que llegó en el link del email
    return this.http.post<{ message: string }>(`${this.api}/verify-email`, { token });
  }

  me(): Observable<SafeUser> {
    return this.http.get<SafeUser>(`${this.api}/me`).pipe(
      tap((user) => this.user.set(user)),
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.user.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.user()?.role === 'admin';
  }

  private handleAuth(res: AuthResponse): void {
    localStorage.setItem(this.tokenKey, res.access_token);
    this.user.set(res.user);
  }
}
