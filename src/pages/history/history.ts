import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { HttpdProvider } from '../../providers/httpd/httpd';
import { DataInfoProvider } from '../../providers/data-info/data-info';
import { UiUtilsProvider } from '../../providers/ui-utils/ui-utils';
import 'rxjs/add/operator/debounceTime';
import * as moment from 'moment-timezone';
import { TicketsPage } from '../../pages/tickets/tickets';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';


@IonicPage()
@Component({
  selector: 'page-history',
  templateUrl: 'history.html',
})
export class HistoryPage {

  allOrders: Observable<any>;
  ticketsCallback: any = []
  dayBegin: string = "";
  dayEnd: string = ""
  ticketsSelect: any = []

  searchTerm: string = '';
  searching: any = false;
  searchControl: FormControl;

  constructor(public navCtrl: NavController, 
    public httpd: HttpdProvider,
    public uiUtils: UiUtilsProvider,
    public dataInfo: DataInfoProvider,
    public navParams: NavParams) {

      moment.locale('pt-br');    
     
      this.searchControl = new FormControl();

      this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
        this.searching = false;
        this.setFilteredItems();
      });
  }

  ionViewDidLoad() {    

    console.log(this.dataInfo.appType)


    if(this.dataInfo.appType === 1){
      this.dayBegin = moment().startOf('day').format()      
      this.dayEnd = moment().endOf('day').format()

      this.searchContinue()
    }
      
    else if(this.dataInfo.appType === 2){
      this.dayBegin = moment().subtract(5, "days").startOf('day').format()          
      this.dayEnd = moment().endOf('day').format()
    }      
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
    
    console.log(this.dataInfo.appType)

    if(this.dataInfo.appType === 1)
      this.searchHistoryPDViByName()    
   else
      this.searchHistoryOnlineByName()
  }

  searchHistoryPDViByName(){
    this.ticketsCallback = []

    this.allOrders = this.httpd.getTicketOperator(this.dataInfo.userInfo.id_usuario, this.dayBegin, this.dayEnd)
    this.allOrders.subscribe(data => {      

      data.success.forEach(element => {        
        element.data_log_venda = moment(element.data_log_venda).tz('America/Sao_Paulo').format("L")        
        this.ticketsCallback.push(element)
      });

      console.log(this.ticketsCallback)
    })
  }

  searchHistoryOnlineByName(){
    this.ticketsCallback = []
    this.allOrders = this.httpd.getAllOrdersByName(this.searchTerm, this.dayBegin, this.dayEnd)
    this.allOrders.subscribe(data => {      

      data.success.forEach(element => {        
        element.post_date = moment(element.post_date).tz('America/Sao_Paulo').format("L")        
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
        element.data_log_venda = moment(element.data_log_venda).tz('America/Sao_Paulo').format("L")        
        this.ticketsCallback.push(element)
      });

      console.log(this.ticketsCallback)
    })
  }

  getAllOrders(){
    this.ticketsCallback = []

    this.allOrders = this.httpd.getAllOrders(this.dayBegin, this.dayEnd)
    this.allOrders.subscribe(data => {      

      data.success.forEach(element => {        
        element.post_date = moment(element.post_date).tz('America/Sao_Paulo').format("L")        
        this.ticketsCallback.push(element)
      });

      if(this.ticketsCallback.length == 0)
        this.uiUtils.showAlert(this.dataInfo.titleAtention, this.dataInfo.titleResultEmpty).present()
    })
  }

  goPageTicket(data){
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

      this.httpd.printTicketMultiple(this.ticketsSelect, this.dataInfo.userInfo.login_usuarios)
      .subscribe(() => {
        this.goBack()
      })
    }        
  }

  goBack(){
    this.navCtrl.pop()
  }

}
