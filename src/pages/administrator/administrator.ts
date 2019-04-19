import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataInfoProvider } from '../../providers/data-info/data-info'
import { ProductsPage } from '../products/products';

@IonicPage()
@Component({
  selector: 'page-administrator',
  templateUrl: 'administrator.html',
})
export class AdministratorPage {

  constructor(public navCtrl: NavController, 
    public dataInfo: DataInfoProvider,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdministratorPage');
  }

  goPageProducts(){
    this.navCtrl.push(ProductsPage, {area: 0})
  }

  goPageStock(){

  }


  goPageNotifications(){

  }

}
