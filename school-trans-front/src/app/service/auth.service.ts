// services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

interface AuthResponse {
  token: string;
  studentId: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api';
  private _isAuthenticated = new BehaviorSubject<boolean>(false);
  redirectUrl: string | null = null;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.checkInitialAuth();
  }

  private checkInitialAuth(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this._isAuthenticated.next(true);
    }
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, { username, password })
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('studentId', response.studentId.toString());
          this._isAuthenticated.next(true);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('studentId');
    this._isAuthenticated.next(false);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this._isAuthenticated.value;
  }

  getAuthStatus(): Observable<boolean> {
    return this._isAuthenticated.asObservable();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}