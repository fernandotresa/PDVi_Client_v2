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
    this.uiUtils.showConfirm("Impressão", "Confirmar impressão?").then( res => {
      console.log(res)

      if(res){
        this.navCtrl.popToRoot()
      }
      
    })
  }

}
