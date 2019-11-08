import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, Events } from 'ionic-angular';
import { DataInfoProvider } from '../../providers/data-info/data-info'
import { UiUtilsProvider } from '../../providers/ui-utils/ui-utils'
import { HttpdProvider } from '../../providers/httpd/httpd';
import { Observable } from 'rxjs/Observable';
import { FormControl } from '@angular/forms';

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
    public events: Events,
    public navParams: NavParams) {

      this.searchControl = new FormControl();    

      this.subscribeStuff()
  }

  ionViewDidLoad() {    
    this.reload()    
  }

  subscribeStuff(){
    this.events.subscribe('atualiza-sessoes', () => {
      this.reload()
    })
  }

  ngOnDestroy(){
    this.events.unsubscribe('atualiza-sessoes')
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
  }

  add(){
    this.navCtrl.push('SessionsAddPage');
  }

  setFilteredItems(){

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
    let alert = this.uiUtils.showConfirm("Atenção", "Deseja remover?")  
      alert.then((result) => {

      if(result)  
        this.removeContinue(key)
     })
   }
   
   removeContinue(key){
      this.http.removeSession(key)
      .subscribe(() => {

        this.uiUtils.showAlert('Sucesso', 'Removido com sucesso')
        this.reload()
      })
   }

   


 

}
