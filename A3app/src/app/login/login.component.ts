import { Component } from '@angular/core';
import { User } from '../models/user';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../user.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth-service.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  user: User = new User();
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private userService: UserService, 
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService){
        this.successMessage = this.router.currentNavigation()?.extras.state?.['successMessage'] || '';
  }
  login() {
    this.userService.loginUser(this.user).subscribe({
      next: (data: any) => {
        console.log(data);
        if (data) {
          // Store the user logged in
          this.auth.loginUser(this.user);
          this.successMessage = data.message || 'Login successful!';
          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/34375783/dashboard';
          this.router.navigateByUrl(returnUrl);
        }
      },
      error: (error) => {
        this.errorMessage = error.error.error || 'Failed to register, please try again.';
        console.log("error msg from backend: ", this.errorMessage)
      }
  });
}
};
