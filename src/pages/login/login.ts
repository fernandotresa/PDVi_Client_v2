import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UiUtilsProvider } from '../../providers/ui-utils/ui-utils'
import { DataInfoProvider } from '../../providers/data-info/data-info'
import { Observable } from 'rxjs/Observable';
import { HttpdProvider } from '../../providers/httpd/httpd';
import { HomePage } from '../../pages/home/home';
import { AttachmentsListPage } from '../../pages/attachments-list/attachments-list';
import {Md5} from 'ts-md5/dist/md5';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  @ViewChild('inputUsername') inputUsername;
  @ViewChild('inputEnd') inputEnd;

  allConfigs: Observable<any>;

  autoLogin: Boolean = false
  username: string
  password: string

  constructor(public navCtrl: NavController, 
    public dataInfo: DataInfoProvider,
    public uiUtils: UiUtilsProvider,
    public navParams: NavParams,
    public httpd: HttpdProvider) {
  }

  ionViewDidLoad() {    
    this.autoLogin = this.navParams.get("autoLogin")

    if(this.autoLogin == undefined)
      this.autoLogin = true
            
    if(this.autoLogin)
      this.loginContinue("admin", "Mudaragora00")
      
    let self = this

    setTimeout(function(){
      self.focusUsername()
    }, 3000);      
  }


  focusUsername(){    
    if(this.inputUsername)
      this.inputUsername.setFocus()
  }  

  focusPassword(){    
    if(this.inputEnd)
      this.inputEnd.setFocus()
  }  
  

  goHome(){    
    if(this.dataInfo.appType === 1){
      //this.navCtrl.setRoot(HomePage);
      this.navCtrl.setRoot(AttachmentsListPage);
      
    }      

    else if(this.dataInfo.appType === 2)
      this.navCtrl.setRoot("ShopPage");
  }

  loginUser(): void {        

    if (this.username.length < 3)
      this.uiUtils.showAlert(this.dataInfo.titleWarning, this.dataInfo.titleUsernameMinLenght).present()

    else if (this.password.length < 3)
      this.uiUtils.showAlert(this.dataInfo.titleWarning, this.dataInfo.titlePasswordMinLenght).present()
      
    else 
      this.loginContinue(this.username, this.password)    
  }

  loginContinue(email, pass){
    let passwd = Md5.hashStr(pass);
    
    let loading = this.uiUtils.showLoading(this.dataInfo.titlePleaseWait)    
    loading.present() 
    var self = this

    this.httpd.getAuth(email, passwd)

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
    
    this.dataInfo.ipLocal = data.ip    
    
    if(data.success.length > 0){
      this.dataInfo.userInfo = data.success[0]
      this.goHome()
    }
      
    else  
      this.uiUtils.showAlert(this.dataInfo.titleWarning, this.dataInfo.titleAuthError).present()

        
  }
}
