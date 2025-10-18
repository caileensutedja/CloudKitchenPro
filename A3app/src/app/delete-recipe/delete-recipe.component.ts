import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { Recipe } from '../models/recipe';
import { RecipeService } from '../recipe.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-recipe',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './delete-recipe.component.html',
  styleUrl: './delete-recipe.component.css'
})
export class DeleteRecipeComponent {
  recipes: Recipe[] = [];
  deleteRecipeId: string = '';

  
  constructor(private recipeService: RecipeService, private router: Router){}
  
    ngOnInit(){
      this.recipeService.getRecipe()
      .subscribe((data: any) => { this.recipes = data});
    }


  private modalService = inject(NgbModal);

  openConfirmationDialog(content: any) {
    if (!this.deleteRecipeId) {
      alert('Please select a recipe first!');
      return;
    }

    const modalRef = this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true
    });

    modalRef.result.then((result) => {
      if (result === 'yes') {
        this.deleteRecipe();
      }
    }).catch((error) => {
      console.log('Modal dismissed', error);
    });
  }

  deleteRecipe(){
  this.recipeService.createRecipe(this.deleteRecipeId)
      .subscribe((data: any) => {
          console.log(data);
          this.router.navigate(["list-recipe"]);
      })
  }
}
