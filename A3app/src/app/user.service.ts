import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

const API_URL = "/34375783/user";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json"
  })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient){}
  getRegister(){
      return this.http.get(API_URL + "/register");
  };

  createUser(user: any){
    console.log("hi")
      return this.http.post(API_URL + "/register", user, httpOptions);
  };

  getLogin(){
      return this.http.get(API_URL + "/login");
  };

  loginUser(user: any){
      return this.http.post(API_URL + "/login", user, httpOptions);
  };
}
