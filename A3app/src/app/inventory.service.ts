import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

const API_URL = "/34375783/inventory";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json"
  })
};

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  constructor(private http: HttpClient){}
  
    createInventory(inventory: any){
        return this.http.post(API_URL + "/add", inventory, httpOptions);
    }
  
    getInventory(){
      return this.http.get(API_URL + "/view");
    }
  

    deleteInventory(id: string){
      return this.http.delete(API_URL + "/delete/" + id);
    }
}
