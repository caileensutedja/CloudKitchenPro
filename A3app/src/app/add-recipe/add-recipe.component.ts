import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Recipe } from '../models/recipe';
import { RecipeService } from '../recipe.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-recipe',
  imports: [FormsModule],
  templateUrl: './add-recipe.component.html',
  styleUrl: './add-recipe.component.css'
})
export class AddRecipeComponent {
  recipe: Recipe = new Recipe();
  message: string = '';

  constructor(private recipeService: RecipeService, private router: Router){}

  addRecipe() {
    this.recipeService.createRecipe(this.recipe)
    .subscribe((data: any) => {
        console.log(data);
        this.router.navigate(["list-recipe"]);
    })
  }
}
