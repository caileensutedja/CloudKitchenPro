import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Inventory } from '../models/inventory';
import { InventoryService } from '../inventory.service';
import { AuthService } from '../auth-service.service';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-view-inventory',
  imports: [FormsModule, DatePipe, RouterLink],
  templateUrl: './view-inventory.component.html',
  styleUrl: './view-inventory.component.css'
})

export class ViewInventoryComponent {
  message: string = '';
  errorMessage: string = '';
  count: number = 0;
  totalCost: number = 0;
  lowStock: Inventory[] = [];
  expiringSoon: Inventory[] = [];
  inventoryByCategory: { 
      _id: string;
      categoryCount: number;
      inventory: Inventory[];
      }[] = [];
  deleteInventoryId: string = '';
  editInventoryId: any = '';
  editInventoryContent: any = {};
  unitTypes: string[] = ["pieces", "kg", "g", "liters", "ml", "cups", "tbsp", "tsp", "dozen"];
  categoryTypes: string[] = ["Vegetables", "Fruits", "Meat", "Dairy", "Grains", "Spices", "Beverages", "Frozen", "Canned", "Other"];
  locationTypes: string[] = ["Fridge", "Freezer", "Pantry", "Counter", "Cupboard"];


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

  private modalService = inject(NgbModal);

  openConfirmationDialog(content: any, inventoryId: any) {
    if (!inventoryId) {
      alert('Please select an inventory item first!');
      return;
    }
    this.deleteInventoryId = inventoryId;

    const modalRef = this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true
    });

    modalRef.result.then((result) => {
      if (result === 'yes') {
        this.deleteInventory();
      }
    }).catch((error) => {
      this.errorMessage = error.error.message
      console.log('Modal dismissed', error);
    });
  }

  deleteInventory(){
  this.inventoryService.deleteInventory(this.deleteInventoryId)
      .subscribe({
        next: (data: any) => {
          console.log('Deleted:', data);
          this.message = 'Inventory successfully deleted!';
          this.ngOnInit();
        },
        error: (err: any) => {
          console.error('Delete failed:', err);
          alert('Failed to delete inventory. Please try again.');
        }
    });
  }

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
          console.error('Fetchign data failed:', err);
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
        this.message = 'Inventory successfully updated!';
        this.ngOnInit();
        
      },
      error: (error: any) => {
        const msg = error.error.error || [error.error.error || 'Failed to edit inventory, please try again.']
        alert(msg);
      }
    });
}
}
