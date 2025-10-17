export class Ingredient {
    quantity: number;
    unit: string;
    name: string;
    constructor(){
        this.quantity = 0;
        this.unit = '';
        this.name = '';
    }
}

export class Recipe {
    recipeId: string;
    userId: string;
    title: string;
    chef: string;
    ingredients: Ingredient[];
    instructions: string[];
    mealType: string;
    cuisineType: string;
    prepTime: number;
    difficulty: string;
    servings: number;
    createdAt: string;
    constructor(){
        this.recipeId = '';
        this.userId = '';
        this.title = '';
        this.chef = '';
        this.ingredients = [];
        this.instructions = [];
        this.mealType = '';
        this.cuisineType = '';
        this.prepTime = 0;
        this.difficulty = '';
        this.servings = 1;
        this.createdAt = '20-10-2025';
    }
}