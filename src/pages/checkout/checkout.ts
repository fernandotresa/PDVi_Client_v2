import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams, ModalController } from 'ionic-angular';
import { HttpdProvider } from '../../providers/httpd/httpd';
import { DataInfoProvider } from '../../providers/data-info/data-info';

@IonicPage()

@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
})
export class CheckoutPage {

  finalValue: number = 0
  totalSelected: number = 0
  products: any = []
  productsSelect: any = []

  constructor(public navCtrl: NavController,     
    public dataInfo: DataInfoProvider,    
    public httpd: HttpdProvider,
    public modalCtrl: ModalController,
    public navParams: NavParams) {            
  }

  ionViewDidLoad() {       
    this.products = this.navParams.get("products")
    this.totalSelected = this.navParams.get("totalSelected")
    this.finalValue = this.navParams.get("finalValue")

    this.productsSelect = []
    

    for(var i = this.products.length - 1; i >= 0; i--) {
      if(this.products[i].quantity > 0) {        
        this.productsSelect.push(this.products[i])
      }
    } 
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
    let modal = this.modalCtrl.create('PaymentPage', {productSelected: this.productsSelect, 
      totalSelected: this.totalSelected, finalValue: this.finalValue});

    modal.onDidDismiss(data => {
      this.paymentFinish(data);
    });
    modal.present();
  }

  paymentFinish(data){
    console.log(data)
    this.navCtrl.pop()    
  }


}
