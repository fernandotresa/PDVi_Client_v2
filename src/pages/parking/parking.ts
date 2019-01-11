import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpdProvider } from '../../providers/httpd/httpd';
import { DataInfoProvider } from '../../providers/data-info/data-info';
import { Observable } from 'rxjs/Observable';
import { FormControl } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-parking',
  templateUrl: 'parking.html',
})
export class ParkingPage {

  parking: Observable<any>;
  searchTerm: string = '';
  searching: any = false;
  searchControl: FormControl;
  ticketParking: any = []

  constructor(public navCtrl: NavController, 
    public dataInfo: DataInfoProvider,
    public httpd: HttpdProvider,
    public navParams: NavParams) {

      this.searchControl = new FormControl();

      this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
        this.searching = false;
        this.setFilteredItems();
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ParkingPage');
  }

  goBack(){
    this.navCtrl.pop()
  }

  addParking(){

  }

  setFilteredItems(){

    if(this.searchTerm.length > 1){

      console.log(this.searchTerm)

      this.httpd.getTicketParking(this.searchTerm)
      .subscribe(data => {
  
          this.getTicketParkingCallback(data)    
      })
    }    
  }

  getTicketParkingCallback(data){
      
      this.ticketParking = data.success
      console.log(this.ticketParking)
  }

}
