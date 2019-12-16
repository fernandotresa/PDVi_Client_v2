import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UiUtilsProvider } from '../../providers/ui-utils/ui-utils';
import { HttpdProvider } from '../../providers/httpd/httpd';
import { DataInfoProvider } from '../../providers/data-info/data-info';
import { Observable } from 'rxjs/Observable';
import {Md5} from 'ts-md5/dist/md5';
import { CurrencyPipe } from '@angular/common';

@IonicPage()
@Component({
  selector: 'page-cash-drain',
  templateUrl: 'cash-drain.html',
})
export class CashDrainPage {

  @ViewChild('inputPassword') inputPassword;
  @ViewChild('inputEnd') inputEnd;

  supervisorPassword: string = ""
  supervisorUsername: string = ""
  supervisorId: number = 0    
  supervisorInfo: any = []

  cashDrainTotal: number = 0
  allSupervisors: Observable<any>;

  constructor(public navCtrl: NavController, 
    public dataInfo: DataInfoProvider,    
    public httpd: HttpdProvider,
    public uiUtils: UiUtilsProvider,
    private currencyPipe: CurrencyPipe,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.getSupervisorInfo()  
  } 

  getCurrency(amount: number) {
    return this.currencyPipe.transform(amount, 'BRL', true, '1.2-2');
  }
    
  goBack(){
      this.navCtrl.pop()
  }

  getSupervisorInfo(){
    
    this.allSupervisors = this.httpd.getAuthSupervisor()

    this.allSupervisors
    .subscribe( data => {
        console.log(data)
        this.supervisorInfo = data.success
    }); 
  }    

  focusPassword(){    
    this.inputPassword.setFocus()
  }

  checkSupervisorInfo(){

    let checked = false
    let passwd = Md5.hashStr(this.supervisorPassword);

    this.supervisorInfo.forEach(element => {
      
      if(element.login_usuarios === this.supervisorUsername) {

        if(element.senha_usuarios_pdvi == passwd){
          checked = true      
          this.supervisorId = element.id_usuarios          
        }          
      }        
    });

    if(!checked)
      this.supervisorPassword = ""

      
    return checked;
  }

  finish(){        

    if(! this.checkSupervisorInfo())      
      this.uiUtils.showAlert(this.dataInfo.titleWarning, this.dataInfo.titleAuthError).present()

    else if(this.cashDrainTotal < 0)
      this.uiUtils.showAlert(this.dataInfo.titleWarning, "Valor negativo").present()

    else 
      this.confirm()             
  }

  confirm(){
    let loading = this.uiUtils.showLoading(this.dataInfo.titlePleaseWait)    
    loading.present() 
    var self = this

    this.httpd.confirmCashDrain(this.dataInfo.userInfo.id_usuarios, this.supervisorId, this.cashDrainTotal)

    .subscribe( data => {
      self.uiUtils.showAlertSuccess()
      loading.dismiss()    
      self.goBack()

    }, error => {
      loading.dismiss().then( () => {

        self.uiUtils.showAlert(this.dataInfo.titleWarning, this.dataInfo.titleCashDrainError).present()
        self.goBack()
      });
    });

  }

  cashDrainChanged(){
    
    console.log(this.cashDrainTotal)

    if(this.cashDrainTotal < 0)
      this.cashDrainTotal = 0

    else
      this.getCurrency(this.cashDrainTotal)
  }


  

}
