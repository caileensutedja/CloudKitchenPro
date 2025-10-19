import { Component } from '@angular/core';
import { AuthService } from '../auth-service.service';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-detailed-view-recipe',
  imports: [FormsModule, DatePipe, RouterLink],
  templateUrl: './detailed-view-recipe.component.html',
  styleUrl: './detailed-view-recipe.component.css'
})
export class DetailedViewRecipeComponent {
  recipe: any = {};

  constructor(
    public auth: AuthService, 
    private recipeService: RecipeService, 
    private route: ActivatedRoute){
  }
    ngOnInit(): void {
      const id = this.route.snapshot.paramMap.get('id');
        this.recipeService.getRecipeDetails(id)
          .subscribe({
            next: (data: any) => {
              this.recipe = data.recipe
            },
            error: (err: any) => {
              console.error('Fetchign data failed:', err);
              alert('Failed to get pre-populated recipe content.');
            }
      });
  }
}

