import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class HttpdProvider {
  
  //address : string = 'http://suporte.dbltecnologia.com.br:8085'    
  address : string = 'http://localhost:8085'
  contentHeader: Headers = new Headers({'Content-Type': 'application/json'});
  totemId: number = 1
  
  constructor(public http: HttpClient) {
    console.log('Hello HttpdProvider Provider', this.address);    
  }  

  GET(url) {
    return this.http.get(url);
  }

  getCategories(){

    let myData = JSON.stringify({id: this.totemId});
    const headers = new HttpHeaders({'Content-Type':'application/json'});
    return this.http.post(this.address  + "/getCategories", myData, {headers: headers})
  }

  getProductsCategory(){
    let myData = JSON.stringify({id: this.totemId});
    const headers = new HttpHeaders({'Content-Type':'application/json'});
    return this.http.post(this.address  + "/getProductsCategory", myData, {headers: headers})
  }

  getAllOrders(){
    
    let myData = JSON.stringify({id: this.totemId});
    const headers = new HttpHeaders({'Content-Type':'application/json'});
    return this.http.post(this.address  + "/getAllOrders", myData, {headers: headers})
  }

  getBillingOrders(){
    let myData = JSON.stringify({id: this.totemId});
    const headers = new HttpHeaders({'Content-Type':'application/json'});
    return this.http.post(this.address  + "/getBillingOrders", myData, {headers: headers})
  }

 
}