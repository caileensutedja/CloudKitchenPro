import { Injectable } from '@angular/core';
import { User } from './models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _user: User | null = null;

  constructor() {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this._user = JSON.parse(savedUser);
    }
  }

  /** Save user info on login */
  loginUser(user: User) {
    this._user = user;
    localStorage.setItem('user', JSON.stringify(user));
  }
  /** Returns true if user is logged in */
  isLoggedIn(): boolean {
    return this._user !== null;
  }

  /** Returns the user's role */
  get role(): 'chef' | 'admin' | 'manager' | null {
    return this._user?.role ?? null;
  }

  /** Returns the user object */
  get currentUser(): User | null {
    return this._user
  }

  /** Returns the user's name */
  get userId(): string | null {
    return this._user?.userId ?? null;
  }

  /** Returns the user's name */
  get fullname(): string {
    return this._user?.fullname ?? '';
  }

  /** Returns the user's email */
  get email(): string {
    return this._user?.email ?? ''; //?? '': if fails it can be an empty string
  }
  
  /** Returns boolean if the user has a role */
  hasRole(role: 'chef' | 'admin' | 'manager'): boolean {
    return this._user?.role === role;
  }

  /** Logs out the user */
  logout() {
    this._user = null;
    localStorage.removeItem('user');
  }
}