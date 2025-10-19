import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Inventory } from '../models/inventory';
import { InventoryService } from '../inventory.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-delete-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './delete-inventory.component.html',
  styleUrl: './delete-inventory.component.css'
})
export class DeleteInventoryComponent {
  inventories: Inventory[] = [];
  deleteInventoryId: string = '';
  errorMessage: string = '';
  
  constructor(private inventoryService: InventoryService, private router: Router, private authService: AuthService){}

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

  openConfirmationDialog(content: any) {
    if (!this.deleteInventoryId) {
      alert('Please select an inventory item first!');
      return;
    }

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

          this.router.navigate(["/34375783/inventory/view"], 
            {state: {message: data.message}});
        },
        error: (err: any) => {
          console.error('Delete failed:', err);
          alert('Failed to delete inventory. Please try again.');
        }
    });
  }
}
