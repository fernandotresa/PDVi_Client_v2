import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController, AlertController } from 'ionic-angular';
import { HttpdProvider } from '../../providers/httpd/httpd';
import { UiUtilsProvider } from '../../providers/ui-utils/ui-utils'
import { DataInfoProvider } from '../../providers/data-info/data-info'
import { Observable } from 'rxjs/Observable';
import "rxjs/Rx";
import { FormControl } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-users',
  templateUrl: 'users.html',
})
export class UsersPage {

  users: Observable<any>;

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
    console.log('ionViewDidLoad UsersPage');

    this.users = this.httpd.getUsers()
  }

  setFilteredItems(){
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

  changeUserPassword(user, password_){
    
    console.log(user, password_)
  }
 

}
