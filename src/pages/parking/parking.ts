import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { HttpdProvider } from '../../providers/httpd/httpd';
import { DataInfoProvider } from '../../providers/data-info/data-info';
import { Observable } from 'rxjs/Observable';
import { FormControl } from '@angular/forms';
import * as moment from 'moment-timezone';

@IonicPage()
@Component({
  selector: 'page-parking',
  templateUrl: 'parking.html',
})
export class ParkingPage {

  @ViewChild('inputEnd') inputEnd;

  parking: Observable<any>;
  searchTerm: string = '';
  searching: any = false;
  searchControl: FormControl;
  ticketParking: any = []
  isSold: Boolean = false

  constructor(public navCtrl: NavController, 
    public dataInfo: DataInfoProvider,
    public httpd: HttpdProvider,
    public viewCtrl: ViewController,
    public navParams: NavParams) {

      this.searchControl = new FormControl();

      this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
        this.searching = false;
        this.setFilteredItems();
      });

      moment.locale('pt-br'); 
  }

  ionViewDidLoad() {
  
    let self = this

    setTimeout(function(){
      self.inputEnd.setFocus()
    }, 1000);     
  }

  focusPassword(){    
    console.log("focusPassword")
    this.inputEnd.setFocus()
  }

  goBack(){
    this.navCtrl.pop()
  }

  addParking(){
    this.viewCtrl.dismiss(this.ticketParking)
  }

  setFilteredItems(){

    if(this.searchTerm.length > 1){

      this.httpd.getTicketParking(this.searchTerm)
      .subscribe(data => {
  
          console.log(data)
          this.isSold = false
          this.getTicketParkingCallback(data)    
      })
    }    
  }

  getTicketParkingCallback(data){
      
      this.ticketParking = data.success

      this.ticketParking.forEach(element => {

        element.data_inclusao_utilizavel = moment(element.data_inclusao_utilizavel)
        .tz('America/Sao_Paulo').format("LLLL")        

        if(element.data_log_venda)
          this.isSold = true
      });
  }

}
