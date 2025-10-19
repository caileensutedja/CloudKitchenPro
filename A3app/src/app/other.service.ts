import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

const API_URL = "/34375783";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json"
  })
};

@Injectable({
  providedIn: 'root'
})
export class OtherService {
  constructor(private http: HttpClient){}
  
  dashboard(){
      return this.http.get(API_URL + "/dashboard");
  };

  tts(text: string){
    return this.http.post(API_URL + 'tts', {text: text}, { responseType: 'blob' })
  }

  askGemini(prompt: string) {
    return this.http.post(API_URL + '/ask-gemini', { prompt });
  }
}
