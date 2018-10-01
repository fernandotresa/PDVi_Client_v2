import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CategoriesPage } from '../../pages/categories/categories';
import { OrdersPage } from '../../pages/orders/orders';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {


  constructor(public navCtrl: NavController) {
        
  }

  ionViewDidLoad(){
    
  }

  goPageCategories(){
    this.navCtrl.push(CategoriesPage)
  }

  goPageOrders(){
    this.navCtrl.push(OrdersPage)
  }

  

}
