import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams, ModalController, Events } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { HttpdProvider } from '../../providers/httpd/httpd';
import { UiUtilsProvider } from '../../providers/ui-utils/ui-utils';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import { DataInfoProvider } from '../../providers/data-info/data-info';
import { LoginPage } from '../../pages/login/login';

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

  ticketParking: any = []

  constructor(public navCtrl: NavController, 
    
    public uiUtils: UiUtilsProvider,
    public dataInfo: DataInfoProvider,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public events: Events,
    public httpd: HttpdProvider) {

    this.searchControl = new FormControl();

    this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
      this.searching = false;
    });

    this.area = this.navParams.get("area")    
  }

  ionViewDidLoad() {      
    this.idArea = this.area.id_area_venda 
    this.getAllProducts()

    this.events.subscribe(this.dataInfo.eventPaymentOk, data => {        
      this.getAllProducts()
    });
  }

  goPageSettings(){
    this.navCtrl.push("SettingsPage")
  }

  goPageTicket(){    
    let modal = this.modalCtrl.create('HistoryPage');    

    modal.onDidDismiss( data => {
      
      if(data){

        let alert = this.uiUtils.showAlert(this.dataInfo.titleSuccess, this.dataInfo.titlePrintSuccess)
      
        alert.present()
        .then( () => {
          setTimeout(function(){
            alert.dismiss();
          }, 3000);        
        })
      }      
    });
    
    modal.present();
  } 

  logout(){
    this.navCtrl.setRoot(LoginPage)
  }

  ngOnDestroy() {
    this.events.unsubscribe(this.dataInfo.eventPaymentOk);    
  }

  resetValues(){
    this.finalValue = 0
    this.totalSelected = 0
    this.products = []    
    
    this.ticketParking = []
  }

  setFilteredItems(){
    this.products = []
    this.allProducts = this.httpd.getProductsAreaByName(this.searchTerm, this.idArea)
    this.allProducts.subscribe(data => {      
      this.products = data.success
    })
  }  
 
  getAllProducts(){
    this.resetValues() 

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

    for(var i = 0; i < this.ticketParking.length; ++i){

      let element = this.ticketParking[i]
      element.quantity = 1
      element.parking = true
      this.products.push(element)      
    }
    
    this.navCtrl.push('CheckoutPage', {products: this.products, 
      finalValue: this.finalValue, totalSelected: this.totalSelected})
  }

  presentPromptParking(){
    let modal = this.modalCtrl.create('ParkingPage');
    modal.onDidDismiss(data => {  

      if(data)
        this.parkingInsert(data)
    });
    
    modal.present();
  }

 parkingInsert(data){  
  let ticket = data[0]
  let element = this.ticketParking[0]  
  this.finalValue += ticket.valor_produto
  this.totalSelected++
  this.removeParking(element)

  ticket.isParking = true  
  this.ticketParking.push(ticket)
 }

  presentModal(product){

    let modal = this.modalCtrl.create('SubproductsPage', {productSelected: product});
    modal.onDidDismiss(data => {

      console.log(data)
      
      if(data)
        this.replaceProductSubtype(data);
    });
    
    modal.present();
  }

  replaceProductSubtype(data){    

    let id_produto = data.id_produto
    let fk_id_subtipo_produto = data.fk_id_subtipo_produto

    for(var i = 0; i < this.products.length; ++i){
      let product = this.products[i]

      let product_id_produto = product.id_produto
      
      if(id_produto === product_id_produto){
        product.fk_id_subtipo_produto = fk_id_subtipo_produto
      }
    }
  }

  removeParking(ticket){    
    
    for(var i = 0; i < this.ticketParking.length; ++i){

      let element = this.ticketParking[i]
  
      if(element.id_estoque_utilizavel === ticket.id_estoque_utilizavel)          
          this.finalValue -= this.ticketParking[i].valor_produto
          this.totalSelected--          
          this.ticketParking.splice(i, 1)
    }
  }

  presentModalCashDrain(){
    let modal = this.modalCtrl.create('CashDrainPage');    

    modal.onDidDismiss( data => {
      
      if(data){

        let alert = this.uiUtils.showAlert(this.dataInfo.titleSuccess, this.dataInfo.titlePrintSuccess)
      
        alert.present()
        .then( () => {
          setTimeout(function(){
            alert.dismiss();
          }, 3000);        
        })
      }      
    });
    
    modal.present();
  }

  presentModalChange(){
    let modal = this.modalCtrl.create('CashChangePage');    

    modal.onDidDismiss( data => {
      
      if(data){

        let alert = this.uiUtils.showAlert(this.dataInfo.titleSuccess, this.dataInfo.titlePrintSuccess)
      
        alert.present()
        .then( () => {
          setTimeout(function(){
            alert.dismiss();
          }, 3000);        
        })
      }      
    });
    
    modal.present();
  }

  presentModalExtract(){
    let modal = this.modalCtrl.create('CashStatementPage');    

    modal.onDidDismiss( data => {
      
      if(data){

        let alert = this.uiUtils.showAlert(this.dataInfo.titleSuccess, this.dataInfo.titlePrintSuccess)
      
        alert.present()
        .then( () => {
          setTimeout(function(){
            alert.dismiss();
          }, 3000);        
        })
      }      
    });
    
    modal.present();
  }

}

