import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { DataInfoProvider } from '../../providers/data-info/data-info'
import { UiUtilsProvider } from '../../providers/ui-utils/ui-utils'
import { HttpdProvider } from '../../providers/httpd/httpd';
import { Observable } from 'rxjs/Observable';
import { FormControl } from '@angular/forms';
import { domainToASCII } from 'url';

@IonicPage()
@Component({
  selector: 'page-sessions',
  templateUrl: 'sessions.html',
})
export class SessionsPage {

  allData: Observable<any>;

  searchTerm: string = '';
  searching: any = false;
  searchControl: FormControl;

  selectMode: Boolean = false
  sessions: any

  constructor(public navCtrl: NavController, 
    public uiUtils: UiUtilsProvider,
    public dataInfo: DataInfoProvider,
    public platform: Platform,
    public http: HttpdProvider,
    public navParams: NavParams) {

      this.searchControl = new FormControl();    
  }

  ionViewDidLoad() {    
    this.reload()    
  }

  load(){
    let loading = this.uiUtils.showLoading('Carregando sessões')
    loading.present()

    this.allData.subscribe(data => {      

      this.loadContinue(data)
      loading.dismiss()      
   });
  }

  loadContinue(data){

    this.sessions = []

    data.success.forEach(element => {  
      
      element.status = element.status === 1 ? "Ativo" : "Inativo"
      this.sessions.push(element)
    });

    console.log(this.sessions)
  }

  add(){
    this.navCtrl.push('SessionsAddPage');
  }

  setFilteredItems(){
    console.log(this.searchTerm)

    if(this.searchTerm.length === 0){
      this.reload()
    }
    else {
      this.allData = this.http.getSessionsName(this.searchTerm.toUpperCase())
      this.load()
    }    
  }  

  reload(){    
    this.allData = this.http.getSessions()  
    this.load()
  }

  edit(data_){            
    this.navCtrl.push('SessionsAddPage', {payload: data_})
  }

  duplicate(data_){    
    this.navCtrl.push('SessionsAddPage', {payload: data_, isDuplicate: true})
  }

  remove(key){
    let alert = this.uiUtils.showConfirm("Atenção", "Você tem certeza disso?")  
      alert.then((result) => {

      if(result)  
        this.removeContinue(key)
     })
   }
   
   removeContinue(key){
      this.http.removeSession(key)
      .subscribe(() => {
        this.uiUtils.showAlert('Sucesso', 'Removido com sucesso')
      })
   }


 

}
