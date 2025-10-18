import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth-service.service';
import { OtherService } from '../other.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent {
  userCount: number = 0;
  recipeCount: number = 0;
  inventoryCount: number = 0;
  constructor(public auth: AuthService, private otherService: OtherService) {}

  ngOnInit(): void {
    this.otherService.dashboard().subscribe({
    next: (data: any) => {
      this.userCount = data.userCount;
      this.recipeCount = data.recipeCount;
      this.inventoryCount = data.inventoryCount;
    },
    error: (err) => {
      console.error('Failed to load dashboard')
    }
    })
  };
  
  /** Returns the user's role */
    get role(): 'chef' | 'admin' | 'manager' | null {
      return this.auth.role
    }
  
    /** Returns the user's name */
    get fullname(): string {
      return this.auth.fullname
    }
  
    /** Returns the user's email */
    get email(): string {
      return this.auth.email
    }

    get userId(): string | null {
      return this.auth.userId
    }
}
