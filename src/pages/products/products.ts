import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { HttpdProvider } from '../../providers/httpd/httpd';
import { UiUtilsProvider } from '../../providers/ui-utils/ui-utils';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import { DataInfoProvider } from '../../providers/data-info/data-info';
import { ParkingPage } from '../parking/parking';

@IonicPage()
@Component({
  selector: 'page-products',
  templateUrl: 'products.html',
})
export class ProductsPage {

  finalValue: number = 0
  discount: number = 0
  area: any
  idArea: number = 0
  allProducts: Observable<any>;
  products: any = []

  searchTerm: string = '';
  searching: any = false;
  searchControl: FormControl;

  constructor(public navCtrl: NavController, 
    public uiUtils: UiUtilsProvider,
    public dataInfo: DataInfoProvider,
    public navParams: NavParams,
    public httpd: HttpdProvider) {

    this.searchControl = new FormControl();

    this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
      this.searching = false;
    });

    this.area = this.navParams.get("area")    
  }

  ionViewDidLoad() {      
    console.log(this.area)

    this.idArea = this.area.id_area_acesso  
    this.getAllProducts()
  }

  setFilteredItems(){

  }
 
  getAllProducts(){
    console.log(this.idArea)

    this.allProducts = this.httpd.getProductsArea(this.idArea)

    this.allProducts.subscribe(data => {     

      this.products = data.success 
      console.log(this.products)
    })
  }

  doRefresh(refresher) {   
    this.allProducts = this.httpd.getProductsArea(this.idArea)
    refresher.complete()    
   } 
 

  increment(product){
    console.log(product)

    let loading = this.uiUtils.showLoading(this.dataInfo.titleLoadingInformations)
    loading.present()   

    if(product.quantity == undefined)
    product.quantity = 0

    product.quantity++      

    if(product.quantity < 10){                  
      console.log('ok')

    } else 
      this.uiUtils.showAlert(this.dataInfo.titleWarning, this.dataInfo.titleLimit).present()
    

    loading.dismiss()
  }

  decrement(product){
    console.log(product)

    let loading = this.uiUtils.showLoading(this.dataInfo.titleLoadingInformations)
    loading.present()   
    
    if(product.quantity > 0){   

      if(product.quantity == undefined)
        product.quantity = 0
        
      product.quantity--                    
    } 
    
    loading.dismiss()
  }

  
}
