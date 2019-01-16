import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UiUtilsProvider } from '../../providers/ui-utils/ui-utils';
import { HttpdProvider } from '../../providers/httpd/httpd';
import { DataInfoProvider } from '../../providers/data-info/data-info';

@IonicPage()
@Component({
  selector: 'page-cash-drain',
  templateUrl: 'cash-drain.html',
})
export class CashDrainPage {

  @ViewChild('inputUsername') inputUsername;
  @ViewChild('inputPassword') inputPassword;
  @ViewChild('inputEnd') inputEnd;

  supervisorPassword: string = ""
  supervisorUsername: string = ""
  cashDrainTotal: number = 0
  supervisorIsOk: Boolean = false
  supervisorInfo: any = []

  constructor(public navCtrl: NavController, 
    public dataInfo: DataInfoProvider,    
    public httpd: HttpdProvider,
    public uiUtils: UiUtilsProvider,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CashDrainPage');
    this.inputUsername.setFocus()
  }  

  goBack(){
      this.navCtrl.pop()
  }

  getSupervisorInfo(){

    let loading = this.uiUtils.showLoading(this.dataInfo.titlePleaseWait)    
    loading.present() 
    var self = this

    this.httpd.getAuthSupervisor(this.supervisorUsername, this.supervisorPassword)

    .subscribe( data => {

      this.loginFinish(data)
      loading.dismiss()      
    }, error => {
      loading.dismiss().then( () => {
        self.uiUtils.showAlert(this.dataInfo.titleWarning, this.dataInfo.titleAuthError).present()
      });
    }); 
  }
  
  loginFinish(data){    

    let self = this
    
    if(data.success.length > 0){
      this.supervisorIsOk = true  
      this.supervisorInfo  = data.success[0]

      setInterval(function(){ 
        if(self.inputEnd)
          self.inputEnd.setFocus()
        
      }, 1000);  

    }   
            
    else  {

      this.supervisorIsOk = false
      this.uiUtils.showAlert(this.dataInfo.titleWarning, this.dataInfo.titleAuthError).present()
      .then( () => {

        setInterval(function(){ 
          if(self.inputPassword)
            self.inputPassword.setFocus()
        }, 1000);  
        
      })
    }      
  }

  focusPassword(){    
    this.inputPassword.setFocus()
  }

  finish(){

    let loading = this.uiUtils.showLoading(this.dataInfo.titlePleaseWait)    
    loading.present() 
    var self = this

    this.httpd.confirmCashDrain(this.dataInfo.userInfo.id_usuarios, 
      this.supervisorInfo.id_usuarios, this.cashDrainTotal)

    .subscribe( data => {

      let alert = this.uiUtils.showAlert(this.dataInfo.titleWarning, this.dataInfo.titleCashDrainSuccess)
      
      alert.present()
      .then( () => {
        setTimeout(function(){
          alert.dismiss();
          self.navCtrl.pop()
        }, 3000);        
      })


      loading.dismiss()      
    }, error => {
      loading.dismiss().then( () => {

        self.uiUtils.showAlert(this.dataInfo.titleSuccess, this.dataInfo.titleCashDrainError).present()
      });
    }); 
  }

}
