import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Inventory } from '../models/inventory';
import { InventoryService } from '../inventory.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-add-inventory',
  imports: [FormsModule],
  templateUrl: './add-inventory.component.html',
  styleUrl: './add-inventory.component.css'
})
export class AddInventoryComponent {
  inventory: Inventory = new Inventory();
  messsage: string = '';

  constructor(private inventoryService: InventoryService, private router: Router){}

  addInventory() {
    this.inventoryService.createInventory(this.inventory)
    .subscribe((data: any) => {
      console.log(data);
      this.router.navigate(['/34375783/inventory/view'])
    })
  }
}
