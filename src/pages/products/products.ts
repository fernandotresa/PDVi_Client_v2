import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams, ModalController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { HttpdProvider } from '../../providers/httpd/httpd';
import { UiUtilsProvider } from '../../providers/ui-utils/ui-utils';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import { DataInfoProvider } from '../../providers/data-info/data-info';

@IonicPage()
@Component({
  selector: 'page-products',
  templateUrl: 'products.html',
})
export class ProductsPage {

  finalValue: number = 0
  totalSelected: number = 0
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
    public modalCtrl: ModalController,
    public httpd: HttpdProvider) {

    this.searchControl = new FormControl();

    this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
      this.searching = false;
    });

    this.area = this.navParams.get("area")    
  }

  ionViewDidLoad() {      
    console.log(this.area)

    this.idArea = this.area.id_area_venda 
    this.resetValues() 
    this.getAllProducts()
  }

  resetValues(){
    this.finalValue = 0
    this.totalSelected = 0
    this.products = []
  }

  setFilteredItems(){
    this.products = []
    this.allProducts = this.httpd.getProductsAreaByName(this.searchTerm, this.idArea)
    this.allProducts.subscribe(data => {      
      this.products = data.success
    })
  }  
 
  getAllProducts(){
    this.allProducts = this.httpd.getProductsArea(this.idArea)

    this.allProducts.subscribe(data => {     
      this.products = data.success 
    })
  }

  doRefresh(refresher) {   
    this.allProducts = this.httpd.getProductsArea(this.idArea)
    refresher.complete()    
   } 
 

  increment(product){    
    if(product.quantity == undefined)
      product.quantity = 0
    
    product.quantity++
    product.valor_total = product.valor_produto * product.quantity    
    this.totalSelected++
    this.finalValue += product.valor_produto      
  }

  decrement(product){        
    if(product.quantity > 0){   

      if(product.quantity == undefined)
        product.quantity = 0
        
      product.quantity--         
      product.valor_total = product.valor_produto * product.quantity               
      this.totalSelected--
      this.finalValue -= product.valor_produto
    }         
  }
  
  goPagePayment(){
    this.navCtrl.push('CheckoutPage', {products: this.products, 
      finalValue: this.finalValue, totalSelected: this.totalSelected})
  }

  presentModal(product){
    let modal = this.modalCtrl.create('SubproductsPage', {productSelected: product});
    modal.onDidDismiss(data => {
      this.replaceProductSubtype(data);
    });
    
    modal.present();
  }

  replaceProductSubtype(data){    

    console.log(data)

    let id_produto = data.id_produto
    let fk_id_subtipo_produto = data.fk_id_subtipo_produto

    for(var i = 0; i < this.products.length; ++i){
      let product = this.products[i]

      let product_id_produto = product.id_produto
      
      if(id_produto === product_id_produto){
        console.log("Substituindo ", id_produto, fk_id_subtipo_produto)
        product.fk_id_subtipo_produto = fk_id_subtipo_produto
      }
    }
  }

}

