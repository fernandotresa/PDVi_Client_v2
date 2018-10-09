import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { HttpdProvider } from '../../providers/httpd/httpd';
import { UiUtilsProvider } from '../../providers/ui-utils/ui-utils';
import 'rxjs/add/operator/debounceTime';
import * as moment from 'moment-timezone';
import { TicketsPage } from '../../pages/tickets/tickets';

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

  constructor(public navCtrl: NavController, 
    public httpd: HttpdProvider,
    public uiUtils: UiUtilsProvider,
    public navParams: NavParams) {

      moment.locale('pt-br');    

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HistoryPage');
  }

  search(){    
    
    if(this.dayBegin.length === 0)
      this.uiUtils.showAlert("Atenção", "Data inicial vazia").present()

    else if(this.dayEnd.length === 0)
      this.uiUtils.showAlert("Atenção", "Data final vazia").present()

    else if(moment(this.dayEnd).isBefore(this.dayBegin))
      this.uiUtils.showAlert("Atenção", "Verificar datas").present()

    else 
      this.searchContinue()  
  }

  searchContinue(){

    this.dayBegin = moment(this.dayBegin).startOf('day').format()
    this.dayEnd = moment(this.dayEnd).endOf('day').format()
        
    console.log("Procurando por tickets vendidos entre", this.dayBegin, this.dayEnd)
    this.getAllOrders()
  }

  getAllOrders(){
    this.ticketsCallback = []

    this.allOrders = this.httpd.getAllOrders(this.dayBegin, this.dayEnd)
    this.allOrders.subscribe(data => {      

      data.success.forEach(element => {        
        element.post_date = moment(element.post_date).tz('America/Sao_Paulo').format("L")        
        this.ticketsCallback.push(element)
      });

      console.log(this.ticketsCallback)
    })
  }

  goPageTicket(data){
    this.navCtrl.push(TicketsPage, {orders: data})
  }

}
