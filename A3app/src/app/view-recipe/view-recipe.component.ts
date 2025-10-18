import { Component } from '@angular/core';
import { Recipe } from '../models/recipe';
import { RecipeService } from '../recipe.service';
import { AuthService } from '../auth-service.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-view-recipe',
  imports: [FormsModule, RouterLink],
  templateUrl: './view-recipe.component.html',
  styleUrl: './view-recipe.component.css'
})
export class ViewRecipeComponent {
  recipes: Recipe[] = [];
  count: number = 0;
  message: string = '';
  errorMessage: string = '';

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
}
