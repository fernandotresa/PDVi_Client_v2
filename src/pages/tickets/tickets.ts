import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpdProvider } from '../../providers/httpd/httpd';
import { UiUtilsProvider } from '../../providers/ui-utils/ui-utils';
import { DataInfoProvider } from '../../providers/data-info/data-info';

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
     public dataInfo: DataInfoProvider,
     public httpd: HttpdProvider) {
  }

  ionViewDidLoad() {
    this.orders = this.navParams.get("orders")
  }

  print(){
    let ticket = this.orders.id_estoque_utilizavel
    let msg = this.dataInfo.titleConfirmPrint + ticket

    this.uiUtils.showConfirm(this.dataInfo.titleAtention, msg).then( res => {

      if(res){
        this.printConfirm()
      }      
    })
  }

  printConfirm(){
    let ticket = this.orders.id_estoque_utilizavel

    this.httpd.printTicket(ticket).subscribe(data => {
      this.navCtrl.popToRoot()
      this.uiUtils.showAlert(this.dataInfo.titleAtention, this.dataInfo.titlePrintSendSuccess).present()
    })
  }

  sendEmail(){
    let email = this.orders.billing_email
    let msg = this.dataInfo.titleSendEmailTo + email

    this.uiUtils.showConfirm(this.dataInfo.titleAtention, msg).then( res => {

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
      this.uiUtils.showAlert(this.dataInfo.titleAtention, this.dataInfo.titleEmailSendSuccess).present()
    })
  }

}
