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

  presentModalCashDrain(){
    let modal = this.modalCtrl.create('CashDrainPage');    

    modal.onDidDismiss( data => {
      
      if(data)
        this.uiUtils.showAlertSuccess()        
    });
    
    modal.present();
  }

  presentModalChange(){
    let modal = this.modalCtrl.create('CashChangePage');    

    modal.onDidDismiss( data => {
      
      if(data)
        this.uiUtils.showAlertSuccess()        
    });
    
    modal.present();
  }

  presentModalExtract(){
    let modal = this.modalCtrl.create('CashStatementPage');    

    modal.onDidDismiss( data => {
      
      if(data)
        this.uiUtils.showAlertSuccess()              
    });
    
    modal.present();
  }

  presentModalUsers(){
    let modal = this.modalCtrl.create('UsersPage');    

    modal.onDidDismiss( data => {
            
      if(data)
        this.uiUtils.showAlertSuccess()              
    });
    
    modal.present();
  }

}
