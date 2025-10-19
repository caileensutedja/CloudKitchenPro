import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Header } from './header/header';
import { FooterComponent } from './footer/footer.component';
import { AuthService } from './auth-service.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class AppComponent {

  title = 'assignment3';
  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit() {
    if (this.router.url === '/' || this.router.url === '') {
      if (this.auth.isLoggedIn()) {
        this.router.navigate(['/34375783/dashboard']);
      } else {
        this.router.navigate(['/34375783/user/login']);
      }
    }
  }
}
