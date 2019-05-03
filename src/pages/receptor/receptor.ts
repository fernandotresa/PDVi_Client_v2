import { Component } from '@angular/core';
import { IonicPage, NavController, Events } from 'ionic-angular';
import { DataInfoProvider } from '../../providers/data-info/data-info';
import { Observable } from 'rxjs/Observable';
import { HttpdProvider } from '../../providers/httpd/httpd';
import { UiUtilsProvider } from '../../providers/ui-utils/ui-utils';

@IonicPage()
@Component({
  selector: 'page-receptor',
  templateUrl: 'receptor.html',
})
export class ReceptorPage {

  allReceptors: Observable<any>;

  constructor(public navCtrl: NavController, 
    public uiUtils: UiUtilsProvider,
    public httpd: HttpdProvider,
    public dataInfo: DataInfoProvider,) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReceptorPage');

    this.allReceptors = this.httpd.getAllReceptors()

    this.allReceptors.subscribe(data => {      
      console.log(data)
    })
  } 
  
  sendCommand(idCommand_: number, receptor){

    console.log(receptor)
    
    //let id = this.dataInfo.userInfo.id_usuario
    let id = 1
    let ip_ponto_acesso = receptor.ip_ponto_acesso

    this.httpd.systemCommand(idCommand_, id, ip_ponto_acesso)

    .subscribe( () => {   
      this.uiUtils.showAlertSuccess()    
    })    
  }  

  open(receptor){
    this.sendCommand(1, receptor)        
  }

  close(receptor){
    this.sendCommand(2, receptor)        
  }

  sendAudio(receptor){
    this.sendCommand(3, receptor)        
  }

  
}
