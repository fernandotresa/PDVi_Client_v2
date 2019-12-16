import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events,  ActionSheetController, Platform } from 'ionic-angular';
import { UiUtilsProvider } from '../../providers/ui-utils/ui-utils';
import { HttpdProvider } from '../../providers/httpd/httpd';
import { DataInfoProvider } from '../../providers/data-info/data-info';
import { CameraProvider } from '../../providers/camera/camera'
import { Observable } from 'rxjs/Observable';
import { CurrencyPipe } from '@angular/common';

@IonicPage()
@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {

  @ViewChild('inputEnd') inputEnd;

  finalValue: string
  totalSelected: string
  totalReceived: number
  totalChange: string
  payments: Observable<any>;
  productSelected: any = []  
  paymentForm: string = "Dinheiro"
  isTotalOk: Boolean = false

  urlPicture: string;
  isPrePrinted: Boolean = false

  constructor(
    public navCtrl: NavController, 
    public dataInfo: DataInfoProvider,    
    public httpd: HttpdProvider,
    public uiUtils: UiUtilsProvider,
    public actionsheetCtrl: ActionSheetController,
    public platform: Platform,
    public events: Events,
    public camera: CameraProvider,
    private currencyPipe: CurrencyPipe,
    public navParams: NavParams) {      
  }

  ionViewDidLoad() {    

    this.finalValue = "0"
    this.productSelected = this.navParams.get('productSelected') 
    this.totalSelected = this.navParams.get('totalSelected') 
    this.finalValue = this.navParams.get('finalValue') 
    this.isPrePrinted = this.navParams.get('isPrePrinted')     

    console.log("VALOR FINAL")
    console.log(this.finalValue)
    
    this.setIntervalFocus()

    this.payments = this.httpd.getPaymentsMethods()
    this.payments.subscribe( data => {
      this.setPaymentDefault(data)      
    })    
  }  

  getCurrency(amount: number) {
    return this.currencyPipe.transform(amount, 'BRL', true, '1.2-2');
  }

  setPaymentDefault(data){    
    this.paymentForm = data.success[0].nome_tipo_pagamento    
  }

  setIntervalFocus(){
    let self = this

      setInterval(function(){ 
        self.setFocus();
      }, 1000);      
  }

  setFocus(){  
    if(this.inputEnd)
      this.inputEnd.setFocus();          
  }

  goBack(){
    this.navCtrl.pop()
  }  

  getLastCashierId(){
    let loading = this.uiUtils.showLoading(this.dataInfo.titleLoadingInformations)
    loading.present() 

    this.httpd.getLastCashier(this.dataInfo.userInfo.id_usuarios)
    .subscribe(data => {
      
      loading.dismiss() 
      this.getLastCashierContinue(data)
      
    })
  }

  getLastCashierContinue(data){
    
    let id_caixa_registrado = data.success[0].id_caixa_registrado    

    this.productSelected.forEach(element => {
      element.fk_id_caixa_venda = id_caixa_registrado
    });

    this.finishPayment()
  }
 
  finishPayment(){  
    this.startCheckout()      
  }
  
  startCheckout(){    

    let loading = this.uiUtils.showLoading(this.dataInfo.titleLoadingInformations)
    loading.present() 

    this.httpd.payProducts(
      this.paymentForm, 
      this.productSelected, 
      this.dataInfo.userInfo.id_usuarios, 
      this.dataInfo.userInfo.login_usuarios, 
      this.finalValue, 
      this.isPrePrinted)

    .subscribe( data => {
      this.verifyCallbackPayment()
      loading.dismiss()      
    })
  }

  verifyCallbackPayment(){

    let loading = this.uiUtils.showLoading(this.dataInfo.titleLoadingInformations)
    loading.present() 

    let self = this

    setTimeout(function(){

      self.httpd.getErrors()
      .subscribe(data => {

        self.getErrosCallback(data, loading)
      })    

    }, 5000)

  }

  getErrosCallback(data, loading){

    let erros = false
    let errosArray = []

    data.errorOnSelling.forEach(element => {
      errosArray.push(element)
      erros = true
    });

    loading.dismiss()   

    if(erros){
      this.uiUtils.showAlert(this.dataInfo.titleWarning, this.dataInfo.titlePaymentError).present()

      this.recoverPaymentErros(errosArray)

    } else 
      this.paymentFinish()
            
  }

  recoverPaymentErros(data){
    this.httpd.recoverPaymentErros(data).subscribe( () => {

      this.events.publish(this.dataInfo.eventPaymentOk, 0);
      
      this.navCtrl.pop()  

    })
  }

  paymentFinish(){

    let alert = this.uiUtils.showAlert(this.dataInfo.titleSuccess, this.dataInfo.titlePaymentSuccess)
    let self = this
      
      alert.present()
      .then( () => {

        setTimeout(function(){
          alert.dismiss();
          self.navCtrl.pop()

          self.events.publish(self.dataInfo.eventPaymentOk, 1);
        }, 3000);        
      })
  }

  checkNegative(){
    if(Number(this.totalChange) < 0){
      this.totalChange = "0"
    }

    if(this.totalReceived < 0){
      this.totalReceived = 0
    }

    if(Number(this.finalValue) < 0){
      this.finalValue = "0"
    }
  }
 
  totalChanged(){        
    this.checkNegative()    
    let total = this.totalReceived - Number(this.finalValue)
    this.totalChange = total.toFixed(2)        
    this.checkNegative()

    this.isTotalOk = this.totalReceived >= Number(this.finalValue)
    
  }

  paymentChanged(event){  
    console.log(event)    

  }

  
}
  
