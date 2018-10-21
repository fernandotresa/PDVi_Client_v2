import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { HttpdProvider } from '../../providers/httpd/httpd';
import { UiUtilsProvider } from '../../providers/ui-utils/ui-utils';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import * as moment from 'moment-timezone';
import { TicketsPage } from '../../pages/tickets/tickets';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

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
  }

  ionViewDidLoad() {        
    this.getAllOrders()
  }

  changeListType(){
    this.listMultiple = !this.listMultiple
  }

  getAllOrders(){
    let loading = this.uiUtils.showLoading("Favor aguarde")    
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
    let number = isNaN(+this.searchTerm)
    console.log(number)

    if(!number)
      this.getByName()
    else
      this.getByCPF()

  }

  getByName(){
    let loading = this.uiUtils.showLoading("Procurando pelo nome do cliente, favor aguarde")    
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
    let loading = this.uiUtils.showLoading("Procurando pelo CPF do cliente, favor aguarde")    
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

  insertMultiplePrint(data){
    let id = data.id;    

    for(var i = this.ticketsChecked.length - 1; i >= 0; i--) {
      if(this.ticketsChecked[i] === id) {
        console.log('Removendo:', this.ticketsChecked[i])
        this.ticketsChecked.splice(i, 1);
        id = 0
      }
   }

   console.log(this.ticketsChecked)
   if(id > 0)
    this.ticketsChecked.push(id)
    
  }

  printMultiple(){
    console.log("Imprimindo multiplos...  ")

    this.uiUtils.showConfirm("Impressão multipla", "Deseja imprimir os ingressos selecionados?")
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
