import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { UiUtilsProvider } from '../../providers/ui-utils/ui-utils';
import { HttpdProvider } from '../../providers/httpd/httpd';
import { DataInfoProvider } from '../../providers/data-info/data-info';

@IonicPage()
@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {

  finalValue: number = 0
  totalSelected: number = 0
  totalReceived: number = 0
  totalChange: number = 0

  productSelected: any = []  
  paymentForm: string = "Dinheiro"
  paymentType: number = 1

  constructor(
    public navCtrl: NavController, 
    public actionSheetCtrl: ActionSheetController,
    public dataInfo: DataInfoProvider,    
    public httpd: HttpdProvider,
    public uiUtils: UiUtilsProvider,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentPage');
    this.productSelected = this.navParams.get('productSelected') 
    this.totalSelected = this.navParams.get('totalSelected') 
    this.finalValue = this.navParams.get('finalValue') 
  }

  goBack(){
    this.navCtrl.pop()
  }

  payment() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Selecionar forma de pagamento',
      buttons: [
        {
          text: 'Dinheiro',
          handler: () => {
            this.paymentForm = 'Dinheiro'
            this.paymentType = 1
          }
        },
        {
          text: 'Débito',
          handler: () => {
            this.paymentForm = 'Débito'
            this.paymentType = 2
          }
        },
        {
          text: 'Crédito',
          handler: () => {
            this.paymentForm = 'Crédito'
            this.paymentType = 3
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'         
        }
      ]
    });
 
    actionSheet.present();
  }  

  finishPayment(){
    let loading = this.uiUtils.showLoading(this.dataInfo.titleLoadingInformations)
    loading.present() 

    this.httpd.payProducts(this.paymentType, this.productSelected).subscribe( () => {
      loading.dismiss()

      this.uiUtils.showAlert(this.dataInfo.titleWarning, this.dataInfo.titlePaymentSuccess).present()
      .then( () => {
        this.navCtrl.pop()
      })
    })
  }

  totalChanged(){
    this.totalChange = this.totalReceived - this.finalValue
  }
     
}
  
