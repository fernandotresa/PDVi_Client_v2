import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController, AlertController } from 'ionic-angular';
import { HttpdProvider } from '../../providers/httpd/httpd';
import { UiUtilsProvider } from '../../providers/ui-utils/ui-utils'
import { DataInfoProvider } from '../../providers/data-info/data-info'
import { Observable } from 'rxjs/Observable';
import "rxjs/Rx";
import { FormControl } from '@angular/forms';
import {Md5} from 'ts-md5/dist/md5';

@IonicPage()
@Component({
  selector: 'page-users',
  templateUrl: 'users.html',
})
export class UsersPage {

  supervisorPassword: string = ""
  supervisorUsername: string = ""
  supervisorId: number = 0    
  supervisorInfo: any = []
  
  users: Observable<any>;
  allSupervisors: Observable<any>;

  searchTerm: string = '';
  searching: any = false;
  searchControl: FormControl;

  constructor(public navCtrl: NavController, 
    public httpd: HttpdProvider, 
    public uiUtils: UiUtilsProvider,     
    public alertController: AlertController,  
    public modalCtrl: ModalController, 
    public dataInfo: DataInfoProvider) {

      this.searchControl = new FormControl();

      this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
        this.searching = false;
        this.setFilteredItems();
      });
  }

  ionViewDidLoad() {
    this.getSupervisorInfo()
  }

  setFilteredItems(){
    if(this.checkSupervisorInfo())     
      this.users = this.httpd.getUserByName(this.searchTerm)    
  } 

  async presentAlertPrompt(user) {

    const alert = await this.alertController.create({
      title: 'Modificar senha',

      inputs: [
        {
          name: 'password1',
          type: 'password',
          placeholder: 'Digitar sua senha'
        },
        {
          name: 'password2',
          type: 'password',
          placeholder: 'Confirmar sua senha'
        },
        
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: data => {                        

            if(data.password1 === data.password2)              
              this.changeUserPassword(user, data.password1)            
          }
        }
      ]
    });
    
    await alert.present();
  }  

  getSupervisorInfo(){
    
    this.allSupervisors = this.httpd.getAuthSupervisor()

    this.allSupervisors
    .subscribe( data => {
        this.supervisorInfo = data.success
    }); 
  }    

  checkSupervisorInfo(){

    let checked = false

    this.supervisorInfo.forEach(element => {
      
      if(element.login_usuarios === this.supervisorUsername) {

        if(element.senha_usuarios_pdvi == this.supervisorPassword){
          checked = true      
          this.supervisorId = element.id_usuarios                    
        }          
      }
        
    });

    return checked;
  }

  finish(){     

    if(! this.checkSupervisorInfo())     
      this.uiUtils.showAlert(this.dataInfo.titleWarning, this.dataInfo.titleAuthError).present()      

    else  {
      this.users = this.httpd.getUsers()
      this.uiUtils.showAlert(this.dataInfo.titleSuccess, this.dataInfo.titleAuthSuccess).present()      
    }
      
  }
 
  changeUserPassword(user, password_){

    if(this.supervisorId === 0)
      this.uiUtils.showAlert(this.dataInfo.titleWarning, this.dataInfo.titleAuthError).present()      
    
    else {


      let loading = this.uiUtils.showLoading(this.dataInfo.titlePleaseWait)    
      loading.present() 
      var self = this

      let passwd = Md5.hashStr(password_);

      this.httpd.changePasswordUser(user, passwd)
        .subscribe( () => {

          this.uiUtils.showAlertSuccess()
          loading.dismiss()      

        }), error => {
          loading.dismiss()
          self.uiUtils.showAlert(this.dataInfo.titleWarning, this.dataInfo.titleUserChangePasswordError).present()
      } 

    }        
  }

}
