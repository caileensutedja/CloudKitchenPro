import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Recipe } from '../models/recipe';
import { RecipeService } from '../recipe.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-recipe',
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-recipe.component.html',
  styleUrl: './edit-recipe.component.css'
})
export class EditRecipeComponent {
  recipes: Recipe[] = [];
  message: string = '';
  errorMessage: string = '';
  editRecipeId: any = '';
  editRecipeContent: any = {};
  mealTypes: string[] = ["Breakfast", "Lunch", "Dinner", "Snack"];
  cuisineTypes: string[] = ["Italian", "Asian", "Mexican", "American", "French", "Indian", "Mediterranean", "Other"];
  difficultyLevels: string[] = ['Easy', 'Medium', 'Hard'];
  
  constructor(private recipeService: RecipeService, private router: Router, private authService: AuthService){}
  
    ngOnInit(): void {
      const userId = this.authService.userId;
      this.recipeService.getDeleteRecipe(userId).subscribe({
        next: (data: any) => {
          this.recipes = data.recipes;
        },
      error: (err) => {
        console.error('Failed to load dashboard')
    }})
    }

    private modalService = inject(NgbModal);

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
    const user = this.authService.currentUser;
    this.recipeService.editRecipe({recipe: this.editRecipeContent, user: user})
      .subscribe({
        next: (data: any) => {
          this.router.navigate(["/34375783/recipe/view"], 
            {state: {message: 'Recipe successfully updated!'}});
          
        },
        error: (error: any) => {
          const msg = error.error.error || [error.error.error || 'Failed to create new recipe, please try again.']
          alert(msg);
        }
      });
  }
  }
