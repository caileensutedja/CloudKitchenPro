import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './header/header';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class AppComponent {
  title = 'assignment3';
}
