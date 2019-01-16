import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController } from 'ionic-angular';
import { HttpdProvider } from '../../providers/httpd/httpd';
import { UiUtilsProvider } from '../../providers/ui-utils/ui-utils';
import { DataInfoProvider } from '../../providers/data-info/data-info';


@IonicPage()
@Component({
  selector: 'page-supervisor',
  templateUrl: 'supervisor.html',
})
export class SupervisorPage {

  constructor(public navCtrl: NavController, 
    public uiUtils: UiUtilsProvider,
    public dataInfo: DataInfoProvider,
    public modalCtrl: ModalController,
    public httpd: HttpdProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SupervisorPage');
  }

  presentModalBleeding(){
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
