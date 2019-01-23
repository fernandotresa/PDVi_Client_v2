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

    for(var i = 0; i < this.products.length; i++) {      

      if(this.products[i].quantity > 0) {                
        this.productsSelect.push(this.products[i])
      }
    } 
  }

  goBack(){
    
    this.navCtrl.pop()
  }

  presentModal(product){

    let modal = this.modalCtrl.create('SubproductsPage', {productSelected: product});
    modal.onDidDismiss(data => {
      
      if(data)
        this.searchProductSubtypeQuantity(data);
    });
    
    modal.present();
  }

  searchProductSubtypeQuantity(data){    
    
    let subtypes = data.subtypes       
    let productS = data.productS       

    let subtypesquantities = [] 

    for(var i = 0; i < subtypes.length; ++i){
      let subtype = subtypes[i]

      let quantity = subtype.quantity

      if(quantity > 0)            
        subtypesquantities.push(subtype)
    }
    
    this.searchProductSubtype(subtypesquantities, productS)
  }

  searchProductSubtype(selecteds, productS){    
  
    let id_produto = productS.id_produto    

    for(var i = 0; i < this.products.length; ++i){
      let product = this.products[i]

      let product_id_produto = product.id_produto      
      
      if(id_produto === product_id_produto){

        product.selectedsIds = []
        product.selectedsName = []

        for(var j = 0; j < selecteds.length; ++j){

          let subselected = selecteds[j];

          product.selectedsIds.push(subselected.id_subtipo_produto)
          product.selectedsName.push(subselected.nome_subtipo_produto)
        }
      }
    }    
  }

  increment(product){    
    if(product.quantity == undefined)
      product.quantity = 0
    
    product.quantity++
    product.valor_total = product.valor_produto * product.quantity    

    product.selectedsIds.push(product.id_subtipo_produto)
    product.selectedsName.push(product.nome_subtipo_produto)

    this.totalSelected++
    this.finalValue += product.valor_produto      
  }

  decrement(product){    
    if(product.quantity > 0){   

      if(product.quantity == undefined)
        product.quantity = 0

      if(product.selectedsIds){
        if(product.selectedsIds.length > 0)
          product.selectedsIds.pop()
      }      
      
      if(product.selectedsName){
        
        if(product.selectedsName.length > 0)
          product.selectedsName.pop()
      } 
        
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
    this.navCtrl.pop()    
  }


}
