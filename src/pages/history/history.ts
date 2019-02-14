import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ActionSheetController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { HttpdProvider } from '../../providers/httpd/httpd';
import { DataInfoProvider } from '../../providers/data-info/data-info';
import { UiUtilsProvider } from '../../providers/ui-utils/ui-utils';
import 'rxjs/add/operator/debounceTime';
import * as moment from 'moment-timezone';
import { TicketsPage } from '../../pages/tickets/tickets';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import {Md5} from 'ts-md5/dist/md5';

@IonicPage()
@Component({
  selector: 'page-history',
  templateUrl: 'history.html',
})
export class HistoryPage {

  @ViewChild('inputPassword') inputPassword;
  @ViewChild('inputEnd') inputEnd;

  allOrders: Observable<any>;
  ticketsCallback: any = []
  dayBegin: string = "";
  dayEnd: string = ""
  ticketsSelect: any = []

  searchTerm: string = '';
  searching: any = false;
  searchControl: FormControl;

  supervisorPassword: string = ""
  supervisorUsername: string = ""
  supervisorId: number = 0    
  supervisorInfo: any = []  
  allSupervisors: Observable<any>;
  supervisorOk: Boolean = false

  ticketsChecked: any = []
  listMultiple: Boolean = false

  constructor(public navCtrl: NavController, 
    public httpd: HttpdProvider,
    public uiUtils: UiUtilsProvider,
    public dataInfo: DataInfoProvider,
    public viewCtrl: ViewController,
    public actionSheetController: ActionSheetController,
    public navParams: NavParams) {

      moment.locale('pt-br');    
     
      this.searchControl = new FormControl();

      this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
        this.searching = false;
        this.setFilteredItems();
      });
  }

  ionViewDidLoad() {    

    if(this.dataInfo.appType === 1){
      this.dayBegin = moment().startOf('day').format()      
      this.dayEnd = moment().endOf('day').format()
      
      this.getSupervisorInfo()
    }
      
    else if(this.dataInfo.appType === 2){
      this.dayBegin = moment().startOf('isoWeek').format()      
      this.dayEnd = moment().endOf('isoWeek').format()
    }      
  }
  
  getSupervisorInfo(){
    
    this.allSupervisors = this.httpd.getAuthSupervisor()

    this.allSupervisors
    .subscribe( data => {
        this.supervisorInfo = data.success
        this.searchContinue() 
    }); 
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

    return checked;
  }

  finish(){        

    if(! this.checkSupervisorInfo())      
      this.uiUtils.showAlert(this.dataInfo.titleSuccess, this.dataInfo.titleAuthError).present()

    else 
      this.supervisorOk = true           
  }


  checkInputs(){
    let inputsok = false

    if(this.dayBegin.length === 0)
      this.uiUtils.showAlert(this.dataInfo.titleAtention, this.dataInfo.titleStartDateEmpty).present()

    else if(this.dayEnd.length === 0)
      this.uiUtils.showAlert(this.dataInfo.titleAtention, this.dataInfo.titleEndDateEmpty).present()

    else if(moment(this.dayEnd).isBefore(this.dayBegin))
      this.uiUtils.showAlert(this.dataInfo.titleAtention, this.dataInfo.titleCheckDates).present()

    else
      inputsok = true

    return inputsok
    
  }

  setFilteredItems(){  
     
    if(this.searchTerm.length > 3){

      if(this.dataInfo.appType === 1)
        this.searchHistoryPDViByName()    
      else
        this.searchHistoryOnlineByName()

    }    
  }

  searchHistoryPDViByName(){
    this.ticketsCallback = []

    this.allOrders = this.httpd.getTicketOperatorStr(this.dataInfo.userInfo.id_usuarios, 
      this.dayBegin, this.dayEnd, this.searchTerm)
      
    this.allOrders.subscribe(data => {      

      data.success.forEach(element => {                        

        element.data_log_venda = moment(element.data_log_venda)
          .tz('America/Sao_Paulo').format("DD.MM.YYYY hh:mm:ss")

          console.log(element.data_log_venda)

        this.searchTicketsCashier(element)
      });      
    })

  }

  searchTicketsCashier(element){

    this.httpd.getTicketsCashier(element.id_caixa_registrado)

    .subscribe(data => {      
      let id_estoque_utilizavel = element.id_estoque_utilizavel
      this.ticketsCallback.push(element)

      this.searchTIcketsCashierCallback(data, id_estoque_utilizavel)    
    })
  }


  searchTIcketsCashierCallback(data, id_estoque_utilizavel){

    data.success.forEach(element => {        

      if(element.id_estoque_utilizavel !== id_estoque_utilizavel){
        element.data_log_venda = moment(element.data_log_venda)
          .tz('America/Sao_Paulo').format("DD.MM.YYYY hh:mm:ss")

        this.ticketsCallback.push(element)
      }
      
    });
  }


  searchHistoryOnlineByName(){
    this.ticketsCallback = []
    this.allOrders = this.httpd.getAllOrdersByName(this.searchTerm, this.dayBegin, this.dayEnd)
    this.allOrders.subscribe(data => {      

      data.success.forEach(element => {        
        element.post_date = moment(element.post_date).tz('America/Sao_Paulo').format("L")        
        element.checked = false        
        this.ticketsCallback.push(element)
      });
    })
  }

  search(){        
    if(this.checkInputs())     
      this.searchContinue()  
  }

  searchContinue(){    

    this.dayBegin = moment(this.dayBegin).startOf('day').format()
    this.dayEnd = moment(this.dayEnd).endOf('day').format()

    if(this.dataInfo.appType === 1)
      this.searchHistoryPDVi()    
   else
      this.getAllOrders()
  }
  
  searchHistoryPDVi(){
    this.ticketsCallback = []

    this.allOrders = this.httpd.getTicketOperator(this.dataInfo.userInfo.id_usuarios, this.dayBegin, this.dayEnd)
    this.allOrders.subscribe(data => {      

      data.success.forEach(element => {        
        element.data_log_venda = element.data_log_venda = moment(element.data_log_venda)
        .tz('America/Sao_Paulo').format("DD.MM.YYYY hh:mm:ss")
        

        this.ticketsCallback.push(element)
      });
    })
  }

  getAllOrders(){
    this.ticketsCallback = []

    this.allOrders = this.httpd.getAllOrders(this.dayBegin, this.dayEnd)
    this.allOrders.subscribe(data => {      

      data.success.forEach(element => {        
        element.post_date = moment(element.post_date).tz('America/Sao_Paulo').format("L")        
        element.checked = false
        this.ticketsCallback.push(element)
      });

      if(this.ticketsCallback.length == 0)
        this.uiUtils.showAlert(this.dataInfo.titleAtention, this.dataInfo.titleResultEmpty).present()
    })
  }

  goPageTicket(data){

    if(! this.listMultiple)
      this.navCtrl.push(TicketsPage, {orders: data})              
  }

  ticketClicked(ticket){
    let id_estoque = ticket.fk_id_estoque_utilizavel

    for(var i = 0; i < this.ticketsCallback.length; ++i){
      let ticket = this.ticketsCallback[i]
      let fk_id_estoque_utilizavel = ticket.fk_id_estoque_utilizavel
      
      if(id_estoque === fk_id_estoque_utilizavel)
        ticket.checked = !ticket.checked    
    }
  }

  printSelecteds(){
    this.ticketsSelect = []    

    for(var i = 0; i < this.ticketsCallback.length; ++i) {

      if(this.ticketsCallback[i].checked)
        this.ticketsSelect.push(this.ticketsCallback[i])    
    }     
        
    if(this.ticketsSelect.length === 0)
      this.uiUtils.showAlert(this.dataInfo.titleWarning, this.dataInfo.titleSelectList).present()
    
    else {

      this.httpd.printTicketMultiple(this.ticketsSelect, this.dataInfo.userInfo.login_usuarios, 1)
      .subscribe(() => {
        this.viewCtrl.dismiss(true);
      })
    }        
  }

  goBack(){
    this.viewCtrl.dismiss(false);
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      title: 'Buscar todos no período',
      buttons: [{
        text: 'Hoje',
        role: 'destructive',        
        handler: () => {
          this.dayBegin = moment().startOf('day').format()      
          this.dayEnd = moment().endOf('day').format()
        }
      }, {
        text: 'Semana',        
        handler: () => {
          this.dayBegin = moment().startOf('isoWeek').format()      
          this.dayEnd = moment().endOf('isoWeek').format()
        }
      }, {
        text: 'Mês',        
        handler: () => {
          this.dayBegin = moment().startOf('month').format()      
          this.dayEnd = moment().endOf('month').format()
        }
      },
      {
        text: 'Cancelar',        
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  insertMultiplePrint(data){

    let id = data.id;    

    for(var i = this.ticketsChecked.length - 1; i >= 0; i--) {
      if(this.ticketsChecked[i] === id) {
        this.ticketsChecked.splice(i, 1);
        id = 0
      }
   }

   if(id > 0)
    this.ticketsChecked.push(id)

  }

  changeListType(){
    this.listMultiple = !this.listMultiple
  }

  cleanSelected(){  
    this.ticketsChecked = []
    this.getAllOrders()
  }

  selectAll(){

    this.ticketsChecked = []

    for(var i = 0; i < this.ticketsCallback.length; ++i){
      let ticket = this.ticketsCallback[i]   

      this.ticketClicked(ticket)
    }
  }

  printSelectedsOnline(){
    this.uiUtils.showConfirm(this.dataInfo.titleAtention, this.dataInfo.titleConfirmMultiPrint)
      .then(res => {
        if(res){
          this.printSelectedsOnlineContinue()
        }
      })    
  }

  printSelectedsOnlineContinue(){
    console.log("Continuando impressão online", this.ticketsChecked)

    this.httpd.printTicketMultipleOnline(this.ticketsChecked, this.dataInfo.userInfo.login_usuarios, 1)
      .subscribe(() => {
        this.viewCtrl.dismiss(true);
        this.uiUtils.showAlertSuccess()
      })
  }  

  dayEndChanged(){
    console.log(this.dayEnd)
    this.search()
  }

}
