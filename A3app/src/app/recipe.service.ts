import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

const API_URL = "/34375783/recipe";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json"
  })
};

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  constructor(private http: HttpClient){}

  createRecipe(recipe: any){
      return this.http.post(API_URL + "/add", recipe, httpOptions);
  }

  getRecipe(){
    return this.http.get(API_URL + "/view");
  }

  getDeleteRecipe(userId: any){
    return this.http.get(API_URL + "/delete", { params: { userId }});
  }

  deleteRecipe(id: string){
    return this.http.delete(`${API_URL}/delete/${id}`);
  }
}
