import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { HttpdProvider } from '../../providers/httpd/httpd';

@IonicPage()
@Component({
  selector: 'page-orders',
  templateUrl: 'orders.html',
})
export class OrdersPage {

  allOrders: Observable<any>;

  constructor(public navCtrl: NavController, public httpd: HttpdProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrdersPage');

    this.startInterface()
  }

  startInterface(){
    this.allOrders = this.httpd.getBillingOrders()

    this.allOrders.subscribe(data => {
      console.log(data)
    })
  }

}
