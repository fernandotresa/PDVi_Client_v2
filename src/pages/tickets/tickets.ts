import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpdProvider } from '../../providers/httpd/httpd';
import { UiUtilsProvider } from '../../providers/ui-utils/ui-utils';

@IonicPage()
@Component({
  selector: 'page-tickets',
  templateUrl: 'tickets.html',
})
export class TicketsPage {

  orders: any = [];

  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     public uiUtils: UiUtilsProvider,
     public httpd: HttpdProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TicketsPage');

    this.orders = this.navParams.get("orders")
    console.log(this.orders)
  }

  print(){
    let ticket = this.orders.id_estoque_utilizavel
    let msg = "Confirmar impressão " + ticket

    this.uiUtils.showConfirm("Impressão", msg).then( res => {
      console.log(res)

      if(res){
        this.printConfirm()
      }      
    })
  }

  printConfirm(){
    let ticket = this.orders.id_estoque_utilizavel

    this.httpd.printTicket(ticket).subscribe(data => {
      this.navCtrl.popToRoot()
      this.uiUtils.showAlert('aviso', 'Impressão enviada com sucesso')
    })
  }

  sendEmail(){
    let email = this.orders.billing_email
    let msg = "Enviar e-mail para " + email

    this.uiUtils.showConfirm("Enviar e-mail", msg).then( res => {
      console.log(res)

      if(res){
        this.sendEmailConfirm()
      }      
    })
  }

  sendEmailConfirm(){
    let ticket = this.orders.id_estoque_utilizavel
    let email = this.orders.billing_email

    this.httpd.sendEmail(ticket, email).subscribe(data => {
      this.navCtrl.popToRoot()
      this.uiUtils.showAlert('aviso', 'Email enviado com sucesso')      
    })
  }

}
