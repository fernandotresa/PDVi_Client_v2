import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { UiUtilsProvider } from '../../providers/ui-utils/ui-utils'
import { Observable } from 'rxjs/Observable';
import { HttpdProvider } from '../../providers/httpd/httpd';
import { Storage } from '@ionic/storage';
import { TabsPage } from '../../pages/tabs/tabs';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  allConfigs: Observable<any>;
  autoLogin: Boolean = true

  public loginForm: FormGroup;

  constructor(public navCtrl: NavController, 
    public formBuilder: FormBuilder,  
    public uiUtils: UiUtilsProvider,
    public navParams: NavParams,
    public storage: Storage,
    public httpd: HttpdProvider) {

      this.loginForm = formBuilder.group({
        email: ['',
        Validators.compose([Validators.required])],
        password: ['',
        Validators.compose([Validators.minLength(4), Validators.required])]
    });       
    
   //this.startInterface() 
    this.storage.set('ion_did_tutorial', 'true')   
  }

 /* ionViewDidLoad() {
    var self = this  
    
    this.autoLogin = this.navParams.get("autoLogin")

    if(this.autoLogin == undefined)
      this.autoLogin = true    

    if(this.autoLogin){      

      firebase.auth().onAuthStateChanged(function(user) {

        self.storage.get('ion_did_tutorial').then(res => {
          if (res) {            

            if (user) 
              self.goPageHomeUser()  
            else 
              console.log('No user')                                      
            }
         });              
      });                  
    }
  }

  goPageHomeUser(){    
    this.httpd.getUserByUid().subscribe(data => {
      this.goPageHomeUserContinue(data)         
    })    
  }

  goPageHomeUserContinue(data){    
    data.success.forEach(element => {         
      this.dataInfo.userInfo = element
      this.dataInfo.userType = element.id_type
    });    

    this.goHome()
  }

  goHome(){

    if(this.dataInfo.userType == 1)
        this.navCtrl.setRoot(TabsPage, {primeiroUso: false});
    else
      this.navCtrl.setRoot(HousekeeperPage);
  }

  startInterface(){    
    if(!firebase.apps.length)    
      firebase.initializeApp(this.dataInfo.fireconfig)              
  }  

  loginUser(): void {        
    if (this.loginForm.valid)      
      this.loginContinue(this.loginForm.value.email,this.loginForm.value.password)    
  }

  loginContinue(email, pass){
    
    let loading = this.uiUtils.showLoading(this.dataInfo.pleaseWait)    
    loading.present() 
    var self = this

    this.authProvider.loginUser(email, pass)

    .then( () => {
      loading.dismiss().then( () => {                
        self.goPageHomeUser()

      });
    }, error => {
      loading.dismiss().then( () => {
        self.uiUtils.showAlert(this.dataInfo.warning, this.dataInfo.titleAuthError).present()
      });
    });    
  }

  goToSignup(): void {
    this.navCtrl.push(SignupPage);
  }
  
  goToResetPassword(): void {
    
    if (this.loginForm.valid){
      this.authProvider.resetPassword(this.loginForm.value.email).then( () => {
        this.uiUtils.showAlert(this.dataInfo.warning, this.dataInfo.titleCheckMailbox).present()

      }, error => {
          this.uiUtils.showAlert(this.dataInfo.warning, this.dataInfo.titleAuthRecoveryError)          
      });  

    } else 
        this.uiUtils.showAlert(this.dataInfo.warning, this.dataInfo.titleAuthRecoveryError)
      
  }*/

}
