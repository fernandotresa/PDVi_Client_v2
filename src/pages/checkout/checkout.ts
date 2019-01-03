import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams, ActionSheetController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { HttpdProvider } from '../../providers/httpd/httpd';
import { UiUtilsProvider } from '../../providers/ui-utils/ui-utils';
import 'rxjs/add/operator/debounceTime';
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
    public actionSheetCtrl: ActionSheetController,
    public uiUtils: UiUtilsProvider,
    public dataInfo: DataInfoProvider,    
    public httpd: HttpdProvider,
    public navParams: NavParams) {
      
      this.products = navParams.get("products")
  }

  ionViewDidLoad() {
    
    this.productsSelect = []
    this.finalValue = 0
    this.totalSelected = 0

    for(var i = this.products.length - 1; i >= 0; i--) {
      if(this.products[i].quantity > 0) {        
        this.productsSelect.push(this.products[i])
        this.finalValue += this.products[i].valor_produto
        this.totalSelected++
      }
    }

    console.log(this.productsSelect)
  }

  payment() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Selecionar forma de pagamento',
      buttons: [
        {
          text: 'Dinheiro',
          handler: () => {
            this.payProduct(1)
          }
        },
        {
          text: 'Débito',
          handler: () => {
            this.payProduct(2)
          }
        },
        {
          text: 'Crédito',
          handler: () => {
            this.payProduct(3)
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

    payProduct(id){
      let loading = this.uiUtils.showLoading(this.dataInfo.titleLoadingInformations)
      loading.present() 

      this.httpd.payProducts(id, this.products).subscribe(data => {
        loading.dismiss()

        this.uiUtils.showAlert(this.dataInfo.titleWarning, this.dataInfo.titlePaymentSuccess).present()
      })
    }

}
