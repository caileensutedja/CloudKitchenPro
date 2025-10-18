import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth-service.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  // role : string = '';
  constructor(public auth: AuthService, private router: Router) {}

    logout() {
      this.auth.logout();
      this.router.navigate(['/34375783/user/login']);
    }

    isLoggedIn() {
      return this.auth.isLoggedIn();
    }

    get role(): 'chef' | 'admin' | 'manager' | null {
    return this.auth.role;
    }

}
