import { Component, ViewChild } from '@angular/core';
import { NavController, IonicPage, NavParams, ModalController, Events } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { HttpdProvider } from '../../providers/httpd/httpd';
import { UiUtilsProvider } from '../../providers/ui-utils/ui-utils';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import { DataInfoProvider } from '../../providers/data-info/data-info';
import { LoginPage } from '../../pages/login/login';
import { CashStatementPage } from '../../pages/cash-statement/cash-statement';
import { CashChangePage } from '../../pages/cash-change/cash-change';
import { CashDrainPage } from '../../pages/cash-drain/cash-drain';
import { AttachmentsPage } from '../../pages/attachments/attachments';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@IonicPage()
@Component({
  selector: 'page-products',
  templateUrl: 'products.html',
})
export class ProductsPage {

  @ViewChild('inputSearch') inputSearch;
  @ViewChild('inputProduct') inputProduct;

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
    private iab: InAppBrowser,
    public httpd: HttpdProvider) {

    this.searchControl = new FormControl();

    this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
      this.searching = false;
    });       
  }

  ionViewDidLoad() {   
        
    if(! this.dataInfo.isHome){      
      this.navCtrl.setRoot('LoginPage')
    }
    else {
      this.startInterface()
    }
  }

  startInterface(){
    if(this.dataInfo.isAdmin)
      this.startAdmin()
    else
      this.startOperator()


    if(this.dataInfo.abreTotem)    {
      this.abreTotem()
    }
  }

  abreTotem(){

    this.iab.create('https://localhost/totem_acesso');

    this.httpd.systemCommandLocal()
    .subscribe(() => {      
      console.log('Comando alt tab enviado com sucesso!')
    })
  }

  startAdmin(){
    this.getAllProductsAdmin()
  }

  startOperator(){
    this.area = this.navParams.get("area")    

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
    let modal = this.modalCtrl.create('HistoryPage', {showBackdrop: true, enableBackdropDismiss: true});    

    modal.onDidDismiss( data => {
      
      if(data)
        this.uiUtils.showAlertSuccess()            
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

      this.products.forEach(element => {        
        element.selectedsIds = []
        element.selectedsName = [] 
        element.sessaoLotacacao = 0       
      });

      this.getTicketSessions()
      this.inputSearch.setFocus()
    })
  }

  getAllProductsAdmin(){
    let loading = this.uiUtils.showLoading(this.dataInfo.titlePleaseWait)    
    loading.present() 

    this.resetValues() 

    this.allProducts = this.httpd.getAllProducts()

    this.allProducts.subscribe(data => {

      this.products = data.success       
      this.inputSearch.setFocus()
      
      loading.dismiss()
    })
  }   

  doRefresh(refresher) {   
    this.allProducts = this.httpd.getProductsArea(this.idArea)
    refresher.complete()    
   } 

  increment(product){      
     
    console.log(product)

    let sessaoLotacacao = product.sessaoLotacacao // Lotação
    let quantity = product.quantity // Quantidade solicitada para compra
    let lotacaoAtual = product.lotacaoAtual // Vendidos
    let total = quantity + lotacaoAtual
    product.disponiveis = sessaoLotacacao - lotacaoAtual

    if(this.dataInfo.sessao === 1){

      if(total < sessaoLotacacao){
        this.incrementNormal(product)    
      }

    } else
      this.incrementNormal(product)    
        
  }

  incrementNormal(product){
    product.quantity++
    product.valor_total = product.valor_produto * product.quantity    

    product.selectedsIds.push(product.id_subtipo_produto)
    product.selectedsName.push(product.nome_subtipo_produto)
        
    this.totalSelected++
    this.finalValue += product.valor_produto  
  }
 
  decrement(product){            

    if(product.quantity > 0){

      product.quantity--         
      product.valor_total = product.valor_produto * product.quantity               

      if(product.selectedsIds){
        if(product.selectedsIds.length > 0)
           product.selectedsIds.pop()
      }      
      
      if(product.selectedsName){
        if(product.selectedsName.length > 0){
          product.selectedsName.pop()
        }                
      }      
  
      this.totalSelected--
      this.finalValue -= product.valor_produto
    }     
  }

  goPageCheckout(){

    for(var i = 0; i < this.ticketParking.length; ++i){

      let element = this.ticketParking[i]
      element.quantity = 1
      element.parking = true
      this.products.push(element)      
    }
    
    this.navCtrl.push('CheckoutPage', {products: this.products, 
      finalValue: this.finalValue, totalSelected: this.totalSelected})
  }

  goPagePayment(){

    for(var i = 0; i < this.ticketParking.length; ++i){

      let element = this.ticketParking[i]
      element.quantity = 1
      element.parking = true
      this.products.push(element)      
    }

    let productsSelect = []        

    for(var j = 0; j < this.products.length; j++) {      

      if(this.products[j].quantity > 0)             
        productsSelect.push(this.products[j])                
    } 
    
    let modal = this.modalCtrl.create('PaymentPage', {productSelected: productsSelect, 
      totalSelected: this.totalSelected, finalValue: this.finalValue}, {showBackdrop: true, enableBackdropDismiss: true});

    modal.present();    
  }

  presentPromptParking(){

    let modal = this.modalCtrl.create('ParkingPage', {showBackdrop: true, enableBackdropDismiss: true});
    modal.onDidDismiss(data => {  

      if(data)
        this.parkingInsert(data)
    });
    
    modal.present();
  }

 parkingInsert(data){ 

    let ticket = data[0]        
    this.finalValue += ticket.valor_produto
    this.totalSelected++
    this.removeParking(ticket)

    ticket.isParking = true  
    this.ticketParking.push(ticket)
 }

  presentModal(product){

    let modal = this.modalCtrl.create('SubproductsPage', {productSelected: product}, {showBackdrop: true, enableBackdropDismiss: true});
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

  removeParking(ticket){    
    
    for(var i = 0; i < this.ticketParking.length; ++i){

      let element = this.ticketParking[i]
  
      if(element.id_estoque_utilizavel === ticket.id_estoque_utilizavel){
        this.finalValue -= this.ticketParking[i].valor_produto
        this.totalSelected--          
        this.ticketParking.splice(i, 1)
      }               
    }
  }

  presentModalCashDrain(){
    let modal = this.modalCtrl.create(CashDrainPage, {showBackdrop: true, enableBackdropDismiss: true});    

    modal.onDidDismiss( data => {
      
      if(data){
        this.uiUtils.showAlertSuccess()
      }      
    });
    
    modal.present();
  }

  presentModalChange(){
    let modal = this.modalCtrl.create(CashChangePage, {showBackdrop: true, enableBackdropDismiss: true});    

    modal.onDidDismiss( data => {
      
      if(data){
        this.uiUtils.showAlertSuccess()
      }      
    });
    
    modal.present();
  }

  presentModalExtract(){
    let modal = this.modalCtrl.create(CashStatementPage, {showBackdrop: true, enableBackdropDismiss: true});    

    modal.onDidDismiss( data => {
      
      if(data){
        this.uiUtils.showAlertSuccess()
      }      
    });
    
    modal.present();
  }


  productQuantityChanged(product){

    let sessaoLotacacao = product.sessaoLotacacao
    let quantity = Number(product.quantity)
    let lotacaoAtual = product.lotacaoAtual
    let total = quantity + lotacaoAtual

    console.log(sessaoLotacacao, quantity, lotacaoAtual, total)


    if(this.dataInfo.sessao === 1){

      if(total < sessaoLotacacao){
          this.productChangedContinue()
      } else
        product.quantity = sessaoLotacacao - lotacaoAtual
    }
    else {
      this.productChangedContinue()
    }
            
  }

  productChangedContinue(){
    this.finalValue = 0
    this.totalSelected = 0

    for(var i = 0; i < this.products.length; ++i){
      let product_ = this.products[i]
      let valor_produto = product_.valor_produto
      let quantity = product_.quantity
      
      if(quantity > 0){

        product_.valor_total = product_.valor_produto * quantity    
        let productValueFinal = valor_produto * quantity 
        this.totalSelected += quantity
        this.finalValue += productValueFinal                

        if(product_.selectedsIds.length === 0){

          product_.selectedsIds.push(product_.fk_id_subtipo_produto)
          product_.selectedsName.push(product_.nome_subtipo_produto)        
        }        
      } 
    }
  }

  onKeydown(product){    

    if(product.quantity < 0)
      product.quantity = 0
  }  

  presentModalAttachment(prod){    

    let modal = this.modalCtrl.create(AttachmentsPage, {product: prod});    

    modal.onDidDismiss( data => {
      
      if(data.urls){        

        prod.urlUpload = data.url
        this.uiUtils.showAlertSuccess()
      }      
    });
    
    modal.present();
  }

  getTicketSessions(){

    let loading = this.uiUtils.showLoading(this.dataInfo.titlePleaseWait)    
    loading.present() 
    
    let promises = []

    this.products.forEach(element => {        

       let ticket = element.fk_id_tipo_produto       

       let prom = new Promise((resolve, reject) =>{

        this.httpd.getSessionsTicket(ticket)
          .subscribe(data => {

            this.getTicketSessionsCallback(data, element)
            promises.push(prom)
            resolve()
          })
       })       
    });

    Promise.all(promises)
    .then(() => {

      loading.dismiss()
      this.getTicketSessionsTotal()
    })
  }

  getTicketSessionsCallback(data, ticket){

    data.success.forEach(element => {
      ticket.sessaoNome = element.nome
      ticket.sessaoLotacacao = element.lotacao
    });
  }

  getTicketSessionsTotal(){

    let loading = this.uiUtils.showLoading(this.dataInfo.titlePleaseWait)    
    loading.present() 
    
    let promises = []

    this.products.forEach(element => {        

       let ticket = element.fk_id_tipo_produto       

       let prom = new Promise((resolve, reject) =>{

        this.httpd.getSessionsTicketTotal(ticket)
          .subscribe(data => {

            this.getTicketSessionsTotalCallback(data, element)
            promises.push(prom)
            resolve()
          })
       })       
    });

    Promise.all(promises)
    .then(() => {

      loading.dismiss()
    })
  }

  getTicketSessionsTotalCallback(data, ticket){

    data.success.forEach(element => {      
      ticket.lotacaoAtual = element.lotacaoAtual
    });
  }

}

