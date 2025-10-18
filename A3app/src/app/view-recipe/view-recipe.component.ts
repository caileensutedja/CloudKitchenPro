import { Component } from '@angular/core';
import { Recipe } from '../models/recipe';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-view-recipe',
  imports: [],
  templateUrl: './view-recipe.component.html',
  styleUrl: './view-recipe.component.css'
})
export class ViewRecipeComponent {
  recipes: Recipe[] = [];
  message: string = '';

  constructor(private recipeService: RecipeService){}

  ngOnInit(){
    this.recipeService.getRecipe()
    .subscribe((data: any) => { this.recipes = data});
  }
}
