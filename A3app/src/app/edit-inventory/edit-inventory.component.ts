import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../inventory.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Inventory } from '../models/inventory';

@Component({
  selector: 'app-edit-inventory',
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-inventory.component.html',
  styleUrl: './edit-inventory.component.css'
})
export class EditInventoryComponent {
  inventories: Inventory[] = [];
  errorMessage: string = '';
  message: string = '';
  editInventoryId: any = '';
  editInventoryContent: any = {};
  unitTypes: string[] = ["pieces", "kg", "g", "liters", "ml", "cups", "tbsp", "tsp", "dozen"];
  categoryTypes: string[] = ["Vegetables", "Fruits", "Meat", "Dairy", "Grains", "Spices", "Beverages", "Frozen", "Canned", "Other"];
  locationTypes: string[] = ["Fridge", "Freezer", "Pantry", "Counter", "Cupboard"];


  constructor(private inventoryService: InventoryService, private router: Router, private auth: AuthService){}

  ngOnInit(): void {
      this.inventoryService.getDeleteInventory().subscribe({
        next: (data: any) => {
          this.inventories = data.inventories;
        },
      error: (err) => {
        console.error('Failed to load dashboard')
    }})
    }

  private modalService = inject(NgbModal);

  // Editing Form
  openFormDialog(content: any, inventory: any) {
    this.editInventoryId = inventory;
    this.inventoryService.getEditInventory(this.editInventoryId)
      .subscribe({
        next: (data: any) => {
          this.editInventoryContent = data.inventory
          this.editInventoryContent.purchaseDate = this.editInventoryContent.purchaseDate.split('T')[0];
          this.editInventoryContent.expirationDate = this.editInventoryContent.expirationDate.split('T')[0];
          const modalRef = this.modalService.open(content, { size: 'lg' });
          modalRef.result.then((result) => {
              if (result === 'save') {
                this.editInventory();
              }
            }).catch(() => {});
        },
        error: (err: any) => {
          console.error('Fetching data failed:', err);
          alert('Failed to get pre-populated inventory content.');
        }
    });
}

editInventory() {
  const user = this.auth.currentUser;
  this.inventoryService.editInventory({inventory: this.editInventoryContent, user: user})
    .subscribe({
      next: (data: any) => {
        console.log('Updated:', data);
        this.router.navigate(["/34375783/inventory/view"], 
            {state: {message: 'Inventory successfully updated!'}});
      },
      error: (error: any) => {
        const msg = error.error.error || [error.error.error || 'Failed to edit inventory, please try again.']
        alert(msg);
      }
    });
}
}
