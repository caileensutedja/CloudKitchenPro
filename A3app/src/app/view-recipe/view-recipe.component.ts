import { Component, inject } from '@angular/core';
import { Recipe } from '../models/recipe';
import { RecipeService } from '../recipe.service';
import { AuthService } from '../auth-service.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-view-recipe',
  imports: [FormsModule, RouterLink, DatePipe],
  templateUrl: './view-recipe.component.html',
  styleUrl: './view-recipe.component.css'
})
export class ViewRecipeComponent {
  recipes: Recipe[] = [];
  count: number = 0;
  message: string = '';
  errorMessage: string = '';
  deleteRecipeId: string = '';
  editRecipeId: any = '';
  editRecipeContent: any = {};
  mealTypes: string[] = ["Breakfast", "Lunch", "Dinner", "Snack"];
  cuisineTypes: string[] = ["Italian", "Asian", "Mexican", "American", "French", "Indian", "Mediterranean", "Other"];
  difficultyLevels: string[] = ['Easy', 'Medium', 'Hard'];

  constructor(
    public auth: AuthService, 
    private recipeService: RecipeService, 
    private router: Router){
    this.message = this.router.currentNavigation()?.extras.state?.['message'] || '';
  }

  ngOnInit(): void {
    this.recipeService.getRecipe().subscribe({
      next: (data: any) => {
        this.recipes = data.recipes;
        this.count = data.count
      },
    error: (err) => {
      console.error('Failed to load dashboard')
  }})
  }

  private modalService = inject(NgbModal);

  // Deletion Confirmation Form
  openConfirmationDialog(content: any, recipeId: any) {
    if (!recipeId) {
      alert('Please select a recipe first!');
      return;
    }
    this.deleteRecipeId = recipeId;

    const modalRef = this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true
    });

    modalRef.result.then((result) => {
      if (result === 'yes') {
        this.deleteRecipe();
      }
    }).catch((error) => {
      this.errorMessage = error.error.message
      console.log('Modal dismissed', error);
    });
  }

  deleteRecipe(){
  this.recipeService.deleteRecipe(this.deleteRecipeId)
      .subscribe({
        next: (data: any) => {
          console.log('Deleted:', data);
          this.message = 'Recipe successfully deleted!';
          this.ngOnInit();
        },
        error: (err: any) => {
          console.error('Delete failed:', err);
          alert('Failed to delete recipe. Please try again.');
        }
    });
  }

  // Editing Form
  openFormDialog(content: any, recipe: any) {
  this.editRecipeId = recipe;
    console.log(' recipe is: ', recipe)

  console.log('edit recipe id: ', this.editRecipeId)

  this.recipeService.getEditRecipe(this.editRecipeId)
    .subscribe({
      next: (data: any) => {
        this.editRecipeContent = data.recipe
        const modalRef = this.modalService.open(content, { size: 'lg' });
        modalRef.result.then((result) => {
            if (result === 'save') {
              this.editRecipe();
            }
          }).catch(() => {});
      },
      error: (err: any) => {
        console.error('Fetchign data failed:', err);
        alert('Failed to get pre-populated recipe content.');
      }
    });
}

  editRecipe() {
    const user = this.auth.currentUser;
    this.recipeService.editRecipe({recipe: this.editRecipeContent, user: user})
      .subscribe({
        next: (data: any) => {
          console.log('Updated:', data);
          this.message = 'Recipe successfully updated!';
          this.ngOnInit();
          
        },
        error: (error: any) => {
          const msg = error.error.error || [error.error.error || 'Failed to create new recipe, please try again.']
          alert(msg);
        }
      });
  }

  get userId(): string | null {
        return this.auth.userId
      }
}
