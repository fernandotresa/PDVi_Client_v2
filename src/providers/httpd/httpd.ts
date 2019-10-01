import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { DataInfoProvider } from '../../providers/data-info/data-info'

@Injectable()
export class HttpdProvider {
  
  //address : string = 'http://produtos.dbltecnologia.com.br:8086'    
  address : string = 'http://localhost:8086'    
  contentHeader: Headers = new Headers({'Content-Type': 'application/json'});
  totemId: number = 1
  
  constructor(
    public http: HttpClient, 
    public dataInfo: DataInfoProvider) {
  
  }  

  GET(url) {
    return this.http.get(url);
  }

  getUsers(){
    let myData = JSON.stringify({id: 1});
    const headers = new HttpHeaders({'Content-Type':'application/json'});
    return this.http.post(this.address  + "/getUsers", myData, {headers: headers})
  }

  getUserByName(name_){
    let myData = JSON.stringify({ name: name_});
    const headers = new HttpHeaders({'Content-Type':'application/json'});
    return this.http.post(this.address  + "/getUserByName", myData, {headers: headers})
  }

  changePasswordUser(user_, password_){
    let myData = JSON.stringify({ user: user_, password: password_});
    const headers = new HttpHeaders({'Content-Type':'application/json'});
    return this.http.post(this.address  + "/changePasswordUser", myData, {headers: headers})
  }

  getAllOrders(start_, end_){    
    let myData = JSON.stringify({id: this.totemId, start: start_, end: end_});
    const headers = new HttpHeaders({'Content-Type':'application/json'});
    return this.http.post(this.address  + "/getAllOrders", myData, {headers: headers})
  }

  getAllOrdersByName(str_, start_, end_){    
    let myData = JSON.stringify({id: this.totemId, name: str_, start: start_, end: end_});
    const headers = new HttpHeaders({'Content-Type':'application/json'});
    return this.http.post(this.address  + "/getAllOrdersByName", myData, {headers: headers})
  }

  getAllOrdersByCPF(str_, start_, end_){    
    let myData = JSON.stringify({id: this.totemId, name: str_, start: start_, end: end_});
    const headers = new HttpHeaders({'Content-Type':'application/json'});
    return this.http.post(this.address  + "/getAllOrdersByCPF", myData, {headers: headers})
  }

  getOrdersNotCompleted(){    
    let myData = JSON.stringify({id: this.totemId});
    const headers = new HttpHeaders({'Content-Type':'application/json'});
    return this.http.post(this.address  + "/getOrdersNotCompleted", myData, {headers: headers})
  }

  sendEmail(idTicket_, email_){    
    let myData = JSON.stringify({idTicket: idTicket_, email: email_});
    const headers = new HttpHeaders({'Content-Type':'application/json'});
    return this.http.post(this.address  + "/sendEmail", myData, {headers: headers})
  }

  getTicketOperator(idUser_: number, start_: string , end_: string){    
    let myData = JSON.stringify({idUser: idUser_, start: start_, end: end_});
    const headers = new HttpHeaders({'Content-Type':'application/json'});
    return this.http.post(this.address  + "/getTicketOperator", myData, {headers: headers})
  }

  getTicketOperatorStr(idUser_: number, start_: string , end_: string, str_: string){    
    let myData = JSON.stringify({idUser: idUser_, start: start_, end: end_, str: str_});
    const headers = new HttpHeaders({'Content-Type':'application/json'});
    return this.http.post(this.address  + "/getTicketOperatorStr", myData, {headers: headers})
  }

  getTicketsCashier(idCashier_: number){    
    let myData = JSON.stringify({idCashier: idCashier_});
    const headers = new HttpHeaders({'Content-Type':'application/json'});
    return this.http.post(this.address  + "/getTicketsCashier", myData, {headers: headers})
  }

  printTicket(idTicket_){    
    let myData = JSON.stringify({idTicket: idTicket_});
    const headers = new HttpHeaders({'Content-Type':'application/json'});
    return this.http.post(this.address  + "/printTicket", myData, {headers: headers})
  }

  printTicketMultiple(tickets_, userName_, reprint_){    
    let myData = JSON.stringify({tickets: tickets_, userName: userName_, reprint: reprint_});
    const headers = new HttpHeaders({'Content-Type':'application/json'});
    return this.http.post(this.address  + "/printTicketMultiple", myData, {headers: headers})
  }

  printTicketMultipleOnline(tickets_, userName_, reprint_){    
    let myData = JSON.stringify({tickets: tickets_, userName: userName_, reprint: reprint_});
    const headers = new HttpHeaders({'Content-Type':'application/json'});
    return this.http.post(this.address  + "/printTicketMultipleOnline", myData, {headers: headers})
  }

  getAreas(){    
    let myData = JSON.stringify({id: this.totemId});
    const headers = new HttpHeaders({'Content-Type':'application/json'});
    return this.http.post(this.address  + "/getAreas", myData, {headers: headers})
  }

  getPaymentsMethods(){    
    let myData = JSON.stringify({id: this.totemId});
    const headers = new HttpHeaders({'Content-Type':'application/json'});
    return this.http.post(this.address  + "/getPaymentsMethods", myData, {headers: headers})
  }

  getAreasByName(name_){    
    let myData = JSON.stringify({id: this.totemId, name: name_});
    const headers = new HttpHeaders({'Content-Type':'application/json'});
    return this.http.post(this.address  + "/getAreasByName", myData, {headers: headers})
  }  
  
  getAllProducts(){    
    let myData = JSON.stringify({id: this.totemId});
    const headers = new HttpHeaders({'Content-Type':'application/json'});
    return this.http.post(this.address  + "/getAllProducts", myData, {headers: headers})
  }

  getProductsAttachments(idUser_, start_, end_){    
    let myData = JSON.stringify({id: this.totemId, idUser: idUser_, start: start_, end: end_});
    const headers = new HttpHeaders({'Content-Type':'application/json'});
    return this.http.post(this.address  + "/getProductsAttachments", myData, {headers: headers})
  }

  getProductsAttachmentsName(idUser_, start_, end_, name_){
    let myData = JSON.stringify({id: this.totemId, idUser: idUser_, start: start_, end: end_, name: name_});
    const headers = new HttpHeaders({'Content-Type':'application/json'});
    return this.http.post(this.address  + "/getProductsAttachmentsName", myData, {headers: headers})
  }

  getProductsArea(idArea_){    
    let myData = JSON.stringify({id: this.totemId, idArea: idArea_});
    const headers = new HttpHeaders({'Content-Type':'application/json'});
    return this.http.post(this.address  + "/getProductsArea", myData, {headers: headers})
  }

  getProductsAreaByName(name_, idArea_){    
    let myData = JSON.stringify({id: this.totemId, name: name_, idArea: idArea_});
    const headers = new HttpHeaders({'Content-Type':'application/json'});
    return this.http.post(this.address  + "/getProductsAreaByName", myData, {headers: headers})
  }

  payProducts(idPayment_, products_, userId_, userName_, finalValue_){
    let myData = JSON.stringify({id: this.totemId, idPayment: idPayment_,
      products: products_, userId: userId_, userName: userName_, finalValue: finalValue_});

    const headers = new HttpHeaders({'Content-Type':'application/json'});
    return this.http.post(this.address  + "/payProducts", myData, {headers: headers})
  }

  getSubtypesProducts(idProduct_){    
    let myData = JSON.stringify({id: this.totemId, idProduct: idProduct_});
    const headers = new HttpHeaders({'Content-Type':'application/json'});
    return this.http.post(this.address  + "/getSubtypesProducts", myData, {headers: headers})
  }

  getAuth(email_, password_){    
    let myData = JSON.stringify({id: this.totemId, email: email_, password: password_});
    const headers = new HttpHeaders({'Content-Type':'application/json'});
    return this.http.post(this.address  + "/getAuth", myData, {headers: headers})
  }

  getAuthSupervisor(){
    let myData = JSON.stringify({id: this.totemId});
    const headers = new HttpHeaders({'Content-Type':'application/json'});
    return this.http.post(this.address  + "/getAuthSupervisor", myData, {headers: headers})
  }

  getTicketParking(idTicket_){        
    let myData = JSON.stringify({id: this.totemId, idTicket: idTicket_});
    const headers = new HttpHeaders({'Content-Type':'application/json'});
    return this.http.post(this.address  + "/getTicketParking", myData, {headers: headers})
  }

  getCashDrain(idUser_, start_, end_){        
    let myData = JSON.stringify({id: this.totemId, idUser: idUser_, start: start_, end: end_});
    const headers = new HttpHeaders({'Content-Type':'application/json'});
    return this.http.post(this.address  + "/getCashDrain", myData, {headers: headers})
  }

  confirmCashDrain(idUser_, idSupervisor_, drainValue_){    
    let myData = JSON.stringify({id: this.totemId, idUser: idUser_,
      idSupervisor: idSupervisor_, drainValue: drainValue_});

    const headers = new HttpHeaders({'Content-Type':'application/json'});
    return this.http.post(this.address  + "/confirmCashDrain", myData, {headers: headers})
  }

  getCashChange(idUser_, start_, end_){        
    let myData = JSON.stringify({id: this.totemId, idUser: idUser_, start: start_, end: end_});
    const headers = new HttpHeaders({'Content-Type':'application/json'});
    return this.http.post(this.address  + "/getCashChange", myData, {headers: headers})
  }

  confirmCashChange(idUser_, idSupervisor_, changeValue_){    
    let myData = JSON.stringify({id: this.totemId, idUser: idUser_,
      idSupervisor: idSupervisor_, changeValue: changeValue_});
      
    const headers = new HttpHeaders({'Content-Type':'application/json'});
    return this.http.post(this.address  + "/confirmCashChange", myData, {headers: headers})
  }

  getTotalTickets(idUser_, start_, end_){        
    let myData = JSON.stringify({id: this.totemId, idUser: idUser_, start: start_, end: end_});
    const headers = new HttpHeaders({'Content-Type':'application/json'});
    return this.http.post(this.address  + "/getTotalTickets", myData, {headers: headers})
  }

  getLastCashier(idUser_){        
    let myData = JSON.stringify({id: this.totemId, idUser: idUser_});
    const headers = new HttpHeaders({'Content-Type':'application/json'});
    return this.http.post(this.address  + "/getLastCashier", myData, {headers: headers})
  }

  getErrors(){    
    let myData = JSON.stringify({idType: 1});
    const headers = new HttpHeaders({'Content-Type':'application/json'});
    return this.http.post(this.address  + "/getErrors", myData, {headers: headers})
  }

  recoverPaymentErros(tickets){    
    
    let myData = JSON.stringify({tickets: tickets});
    const headers = new HttpHeaders({'Content-Type':'application/json'});
    return this.http.post(this.address  + "/recoverPaymentErros", myData, {headers: headers})
  }

  /**
   * COMANDOS RECEPTOR
   */

  getAllReceptors(){
    let myData = JSON.stringify({id: 1});
    const headers = new HttpHeaders({'Content-Type':'application/json'});
    return this.http.post(this.address  + "/getAllReceptors", myData, {headers: headers})
  }
  
  systemCommand(command_: number, idUser_: number, ipPonto_: number){   
    let myData = JSON.stringify({id: this.totemId, idUser: idUser_, cmd: command_, ipPonto: ipPonto_});
    const headers = new HttpHeaders({'Content-Type':'application/json'});
    return this.http.post(this.address  + "/systemCommand", myData, {headers: headers})
  }

  /**
   * PRE VENDAS   
   */

  checkTicket(ticket_){    
    let myData = JSON.stringify({id: this.dataInfo.totemId, ticket: ticket_});
    const headers = new HttpHeaders({'Content-Type':'application/json'});
    return this.http.post(this.address  + "/checkTicket", myData, {headers: headers})
  }

  checkMultipleTickets(start_, end_){    
    let myData = JSON.stringify({id: this.dataInfo.totemId, ticketStart: start_, ticketEnd: end_});
    const headers = new HttpHeaders({'Content-Type':'application/json'});
    return this.http.post(this.address  + "/checkMultipleTickets", myData, {headers: headers})
  }

  useTicketMultiple(value_){
    let myData = JSON.stringify({id: this.dataInfo.totemId, ticket: value_, idArea: this.dataInfo.areaId, idPorta: this.dataInfo.portaId});
    const headers = new HttpHeaders({'Content-Type':'application/json'});
    return this.http.post(this.address  + "/useTicketMultiple", myData, {headers: headers})
  }




}