import { Component, NgZone } from '@angular/core';
import { AuthService } from '../auth-service.service';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { OtherService } from '../other.service';

@Component({
  selector: 'app-detailed-view-recipe',
  imports: [FormsModule, DatePipe, RouterLink, CommonModule],
  templateUrl: './detailed-view-recipe.component.html',
  styleUrl: './detailed-view-recipe.component.css'
})
export class DetailedViewRecipeComponent {
  recipe: any = {};
  geminiAnswer: string = '';
  prompt: string = 'Please analyze recipe healthiness based on ingredients and provide intelligent suggestions for improving nutritional value, in around 100 words';
  loadingAI: boolean = false; 

  constructor(
    public auth: AuthService, 
    private recipeService: RecipeService, 
    private route: ActivatedRoute,
    private otherService: OtherService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.loadRecipe(id)
  }

  loadRecipe(id: any){
    this.recipeService.getRecipeDetails(id).subscribe({
      next: (data: any) => {
        this.recipe = data.recipe;

      },
      error: (err: any) => {
        console.error('Fetching recipe failed:', err);
        alert('Failed to get recipe details.');
      }
    });
  }

  text2speech(recipeText: string) {
    const text = Array.isArray(recipeText) ? recipeText.join('. ') : recipeText;
    this.otherService.tts(text).subscribe({
    next: (blob) => {
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.play().then(() => {
        console.log("Audio playing!");
      }).catch(err => {
        console.error("Audio playback error:", err);
      });
    },
    error: (err) => {
      console.error("HTTP error:", err);
    }
  });}

  /** Call Gemini API with recipe prompt */
  generateAIResponse() {
    const text = this.prompt + ' Recipe is: ' + JSON.stringify(this.recipe);

    this.loadingAI = true;
    this.otherService.askGemini(text).subscribe({
      next: (res: any) => {
        this.ngZone.run(() => {  // for Angular to update template
          if (res.success) this.geminiAnswer = res.response;
          else this.geminiAnswer = 'AI failed to respond';
          this.loadingAI = false;
        });
      },
      error: (err: any) => {
        console.error('Gemini HTTP error:', err);
        this.ngZone.run(() => {
          this.geminiAnswer = 'Network or server error';
          this.loadingAI = false;
        });
      }
    });
  }
}