import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { UiUtilsProvider } from '../../providers/ui-utils/ui-utils';
import { HttpdProvider } from '../../providers/httpd/httpd';
import { DataInfoProvider } from '../../providers/data-info/data-info';
import { Observable } from 'rxjs/Observable';

@IonicPage()
@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {

  @ViewChild('inputEnd') inputEnd;

  finalValue: number = 0
  totalSelected: number = 0
  totalReceived: number = 0
  totalChange: number = 0
  payments: Observable<any>;
  productSelected: any = []  
  paymentForm: string = "Dinheiro"

  constructor(
    public navCtrl: NavController, 
    public dataInfo: DataInfoProvider,    
    public httpd: HttpdProvider,
    public uiUtils: UiUtilsProvider,
    public events: Events,
    public navParams: NavParams) {      
  }

  ionViewDidLoad() {    
    this.productSelected = this.navParams.get('productSelected') 
    this.totalSelected = this.navParams.get('totalSelected') 
    this.finalValue = this.navParams.get('finalValue') 
    this.setIntervalFocus()

    this.payments = this.httpd.getPaymentsMethods()
    this.payments.subscribe( data => {
      this.setPaymentDefault(data)      
    })    
  }  

  setPaymentDefault(data){    
    this.paymentForm = data.success[0].nome_tipo_pagamento
    console.log(this.paymentForm)
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
 
  finishPayment(){
    let loading = this.uiUtils.showLoading(this.dataInfo.titleLoadingInformations)
    loading.present() 
    let self = this

    this.httpd.payProducts(this.paymentForm, this.productSelected, 
      this.dataInfo.userInfo.id_usuarios, this.dataInfo.userInfo.login_usuarios, this.finalValue)
    .subscribe( () => {
      loading.dismiss()

      let alert = this.uiUtils.showAlert(this.dataInfo.titleSuccess, this.dataInfo.titlePaymentSuccess)
      
      alert.present()
      .then( () => {
        setTimeout(function(){
          alert.dismiss();
          self.navCtrl.pop()

          self.events.publish(self.dataInfo.eventPaymentOk, 1);
        }, 3000);        
      })
    })
  }

  totalChanged(){    
    this.totalChange = this.totalReceived - this.finalValue
  }

  paymentChanged(event){
    console.log(event)
  }
     
}
  
