import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Recipe } from '../models/recipe';
import { RecipeService } from '../recipe.service';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth-service.service';

@Component({
  selector: 'app-add-recipe',
  imports: [FormsModule],
  templateUrl: './add-recipe.component.html',
  styleUrl: './add-recipe.component.css'
})
export class AddRecipeComponent {
  recipe: Recipe = new Recipe();
  errorMessage: string[] = [];
  message: string = '';
  mealTypes: string[] = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Pastry', 'Beverage', 'Other'];
  cuisineTypes: string[] = ["Italian", "Asian", "Mexican", "American", "French", "Indian", "Mediterranean", "Other"];
  difficultyLevels: string[] = ['Easy', 'Medium', 'Hard'];
  
  constructor(private recipeService: RecipeService, private router: Router, private authService: AuthService){}

  addRecipe() {
    const user = this.authService.currentUser;
    
    this.recipeService.createRecipe({recipe: this.recipe, user: user}).subscribe({
      next: (data: any) => {
        console.log(data);
        this.router.navigate(
          ["/34375783/recipe/view"],
          {state: {message: 'Recipe is successfully added!'}});
      },
      error:(error) => {
        this.errorMessage = error.error.error || [error.error.error || 'Failed to create new recipe, please try again.']
        console.log("error msg from backend: ", this.errorMessage)
      }
    });
}
};
