import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Inventory } from '../models/inventory';
import { InventoryService } from '../inventory.service';
import { Route, Router } from '@angular/router';
import { AuthService } from '../auth-service.service';

@Component({
  selector: 'app-add-inventory',
  imports: [FormsModule],
  templateUrl: './add-inventory.component.html',
  styleUrl: './add-inventory.component.css'
})
export class AddInventoryComponent {
  inventory: Inventory = new Inventory();
  messsage: string = '';
  errorMessage: string[] = [];
  unitTypes: string[] = ["pieces", "kg", "g", "liters", "ml", "cups", "tbsp", "tsp", "dozen"];
  categoryTypes: string[] = ["Vegetables", "Fruits", "Meat", "Dairy", "Grains", "Spices", "Beverages", "Frozen", "Canned", "Other"];
  locationTypes: string[] = ["Fridge", "Freezer", "Pantry", "Counter", "Cupboard"];

  constructor(private inventoryService: InventoryService, private router: Router, private authService: AuthService){}

  addInventory() {
    const user = this.authService.currentUser;

    this.inventoryService.createInventory({inventory: this.inventory, user: user}).subscribe({
      next: (data: any) => {
        console.log(data);
        this.router.navigate(
          ["/34375783/inventory/view"],
          {state: {message: 'Inventory is successfully added!'}});
      },
      error:(error) => {
        this.errorMessage = error.error.error || [error.error.error || 'Failed to create new recipe, please try again.']
        console.log("error msg from backend: ", this.errorMessage)
      }
     });
}
};