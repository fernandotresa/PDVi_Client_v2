import { Component } from '@angular/core';
import { NavController, Events, IonicPage } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { HttpdProvider } from '../../providers/httpd/httpd';
import { UiUtilsProvider } from '../../providers/ui-utils/ui-utils';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import * as moment from 'moment-timezone';
import { TicketsPage } from '../../pages/tickets/tickets';
import { DataInfoProvider } from '../../providers/data-info/data-info';
import { HistoryPage } from '../history/history';

@IonicPage()
@Component({
  selector: 'page-shop',
  templateUrl: 'shop.html',
})
export class ShopPage {

  allOrders: Observable<any>;

  searchTerm: string = '';
  searching: any = false;
  searchControl: FormControl;

  dayBegin: any;
  dayEnd: any

  ticketsCallback: any = []
  listMultiple: Boolean = false

  ticketsChecked: any = []

  constructor(public navCtrl: NavController, 
    public uiUtils: UiUtilsProvider,
    public dataInfo: DataInfoProvider,
    public events: Events,
    public httpd: HttpdProvider) {

    moment.locale('pt-br'); 

    this.dayBegin = moment().startOf('day').format()
    this.dayEnd = moment().endOf('day').format()

    console.log(this.dayBegin, this.dayEnd)

    this.searchControl = new FormControl();

    this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
      this.searching = false;
      this.setFilteredItems();
    });

    this.events.publish('userInfo:menu', this.dataInfo.userType);
  }

  ionViewDidLoad() {        
    this.getAllOrders()
  }

  changeListType(){
    this.listMultiple = !this.listMultiple
  }

  getAllOrders(){
    let loading = this.uiUtils.showLoading(this.dataInfo.titlePleaseWait)    
    loading.present() 

    this.ticketsCallback = []

    this.allOrders = this.httpd.getAllOrders(this.dayBegin, this.dayEnd)
    this.allOrders.subscribe(data => {      

      data.success.forEach(element => {        
        element.post_date = moment(element.post_date).tz('America/Sao_Paulo').format("L")        
        this.ticketsCallback.push(element)
      });

      loading.dismiss()
    })
  }

  setFilteredItems(){
    if(this.searchTerm.length > 5){

      let number = Number(this.searchTerm)     
      console.log(number, this.searchTerm)

      if(number)
        this.getByCPF()      

      else
        this.getByName()        
    }          
  }

  getByName(){
    console.log('getByName')

    let loading = this.uiUtils.showLoading(this.dataInfo.titleSearchingClientName)    
    loading.present() 
    
    this.ticketsCallback = []
    this.allOrders = this.httpd.getAllOrdersByName(this.searchTerm, this.dayBegin, this.dayEnd)
    this.allOrders.subscribe(data => {      

      data.success.forEach(element => {        
        element.post_date = moment(element.post_date).tz('America/Sao_Paulo').format("L")        
        this.ticketsCallback.push(element)
      });

      loading.dismiss()
    })
  }

  getByCPF(){
    console.log('getByCPF')

    let loading = this.uiUtils.showLoading(this.dataInfo.titleSearchingClientCPF)    
    loading.present() 
    
    this.ticketsCallback = []
    this.allOrders = this.httpd.getAllOrdersByCPF(this.searchTerm, this.dayBegin, this.dayEnd)
    this.allOrders.subscribe(data => {      

      data.success.forEach(element => {        
        element.post_date = moment(element.post_date).tz('America/Sao_Paulo').format("L")        
        this.ticketsCallback.push(element)
      });

      loading.dismiss()
    })
  }

  goPageTicket(data){
    this.navCtrl.push(TicketsPage, {orders: data})
  }

  goPageHistory(){
    this.navCtrl.push(HistoryPage)
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

  printMultiple(){
    this.uiUtils.showConfirm(this.dataInfo.titleAtention, this.dataInfo.titleConfirmMultiPrint)
      .then(res => {
        if(res){
          this.printMultipleContinue()
        }
      })    
  }

  printMultipleContinue(){
    console.log("Continuando impressão")
  }

}
