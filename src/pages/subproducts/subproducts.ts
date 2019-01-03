import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataInfoProvider } from '../../providers/data-info/data-info';
import { Observable } from 'rxjs/Observable';
import { HttpdProvider } from '../../providers/httpd/httpd';

@IonicPage()
@Component({
  selector: 'page-subproducts',
  templateUrl: 'subproducts.html',
})
export class SubproductsPage {

  productSelected: any;
  allSubtypes: Observable<any>;
  subtypes: any = []

  constructor(
    public navCtrl: NavController, 
    public dataInfo: DataInfoProvider,
    public httpd: HttpdProvider,
    public navParams: NavParams) {

  }

  ionViewDidLoad() {
    this.productSelected = this.navParams.get('productSelected') 
    console.log(this.productSelected)

    this.allSubtypes = this.httpd.getSubtypesProducts(this.productSelected.id_produto)

    this.allSubtypes.subscribe(data => {
      console.log(data.success)
      this.subtypes = data.success
    })
  }

  selectedType(type){
    console.log(type)
    this.navCtrl.pop()
  }


}
