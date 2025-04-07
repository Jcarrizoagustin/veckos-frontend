import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { JwtResponseDto, LoginDto, RegisterDto } from '../models';
import { environment } from '../../environments/entironments';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiBaseUrl}/api/auth`;
  private tokenKey = 'auth_token';
  private userKey = 'auth_user';
  private rolesKey = 'auth_roles';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private userRolesSubject = new BehaviorSubject<string[]>(this.getUserRoles());
  public userRoles$ = this.userRolesSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(loginDto: LoginDto): Observable<JwtResponseDto> {
    return this.http.post<JwtResponseDto>(`${this.apiUrl}/login`, loginDto).pipe(
      tap(response => {
        this.setSession(response);
        this.isAuthenticatedSubject.next(true);
        this.userRolesSubject.next(response.roles);
      })
    );
  }

  register(registerDto: RegisterDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, registerDto);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.rolesKey);
    this.isAuthenticatedSubject.next(false);
    this.userRolesSubject.next([]);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUserRoles(): string[] {
    const rolesStr = localStorage.getItem(this.rolesKey);
    return rolesStr ? JSON.parse(rolesStr) : [];
  }

  isAdmin(): boolean {
    return this.getUserRoles().includes('ROLE_ADMIN');
  }

  isOperador(): boolean {
    return this.getUserRoles().includes('ROLE_OPERADOR');
  }

  hasAnyRole(roles: string[]): boolean {
    const userRoles = this.getUserRoles();
    return roles.some(role => userRoles.includes(role));
  }

  isLoggedIn(): boolean {
    return this.hasToken();
  }

  private setSession(authResult: JwtResponseDto): void {
    localStorage.setItem(this.tokenKey, authResult.token);
    localStorage.setItem(this.userKey, authResult.username);
    localStorage.setItem(this.rolesKey, JSON.stringify(authResult.roles));
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }
}