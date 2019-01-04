import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
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
    public dataInfo: DataInfoProvider,
    public httpd: HttpdProvider,
    public viewCtrl: ViewController,
    public navParams: NavParams) {

  }

  ionViewDidLoad() {
    this.productSelected = this.navParams.get('productSelected') 
    //console.log(this.productSelected)

    this.allSubtypes = this.httpd.getSubtypesProducts(this.productSelected.id_produto)

    this.allSubtypes.subscribe(data => {      
      this.subtypes = data.success
    })
  }

  selectedType(type){
    //console.log(type)
    
    this.productSelected.nome_subtipo_produto = type.nome_subtipo_produto
    this.productSelected.fk_id_subtipo_produto = type.fk_id_subtipo_produto
    this.viewCtrl.dismiss(this.productSelected)
  }


}
