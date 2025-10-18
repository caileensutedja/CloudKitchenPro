import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Inventory } from '../models/inventory';
import { InventoryService } from '../inventory.service';
import { AuthService } from '../auth-service.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-view-inventory',
  imports: [FormsModule, DatePipe, RouterLink],
  templateUrl: './view-inventory.component.html',
  styleUrl: './view-inventory.component.css'
})

export class ViewInventoryComponent {
  message: string = '';
  errorMessage: string = '';
  // inventoryByCategory: string[] = [];
  count: number = 0;
  totalCost: number = 0;
  lowStock: Inventory[] = [];
  expiringSoon: Inventory[] = [];
  inventoryByCategory: { 
      _id: string;
      categoryCount: number;
      inventory: Inventory[];
      }[] = [];

  constructor(
    public auth: AuthService, 
    private inventoryService: InventoryService, 
    private router: Router){
    this.message = this.router.currentNavigation()?.extras.state?.['message'] || '';
  }

  ngOnInit(): void {
    this.inventoryService.getInventory().subscribe({
      next: (data: any) => {
        this.inventoryByCategory = data.inventoryByCategory;
        this.count = data.count,
        this.totalCost = data.totalCost,
        this.lowStock = data.lowStock,
        this.expiringSoon = data.expiringSoon
      },
    error: (err) => {
      console.error('Failed to load dashboard')
  }})
  }

}
