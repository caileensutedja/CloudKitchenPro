import { Component } from '@angular/core';
import { User } from '../models/user';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  user: User = new User();
  successMessage: string = '';
  errorMessage: string[] = [];
  // isError: boolean = false;

  constructor(private userService: UserService, private router: Router){
        this.successMessage = this.router.currentNavigation()?.extras.state?.['successMessage'] || '';

  }
  login() {
    this.userService.loginUser(this.user)
    .subscribe((data: any) => {
        console.log(data);
        this.router.navigate(['/34375783/dashboard']);
    })
  }
}
