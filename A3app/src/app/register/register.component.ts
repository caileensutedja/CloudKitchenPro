import { Component } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../user.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user: User = new User();
  errorMessage: string[] = [];

  constructor(private userService: UserService, private router: Router){}
  
  register() {
    this.userService.createUser(this.user).subscribe({
      next: (data: any) => {
        console.log(data);
        this.router.navigate(
          ["34375783/user/login"], 
        {state: {successMessage: 'Registration successful, please log in!'}
      });
    },
    error: (error) => {
      this.errorMessage = error.error.error || ['Failed to register, please try again.']
      console.log("error msg from backend: ", this.errorMessage)
    }
    });
  }
};
