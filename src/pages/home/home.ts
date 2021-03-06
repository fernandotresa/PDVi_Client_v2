import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { HttpdProvider } from '../../providers/httpd/httpd';
import { UiUtilsProvider } from '../../providers/ui-utils/ui-utils';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import { DataInfoProvider } from '../../providers/data-info/data-info';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  allAreas: Observable<any>;
  areas: any = []

  searchTerm: string = '';
  searching: any = false;
  searchControl: FormControl;

  constructor(public navCtrl: NavController, 
    public uiUtils: UiUtilsProvider,
    public dataInfo: DataInfoProvider,
    public events: Events,
    public httpd: HttpdProvider) {

    this.searchControl = new FormControl();

    this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
      this.searching = false;
      this.setFilteredItems()
    });

    this.events.publish('userInfo:menu', this.dataInfo.userType);
  }

  ionViewDidLoad() {        
    this.getAllAreas()
  }

  setFilteredItems(){
    this.areas = []
    this.allAreas = this.httpd.getAreasByName(this.searchTerm)
    this.allAreas.subscribe(data => {      
      this.areas = data.success
    })
  }
 
  getAllAreas(){
    this.allAreas = this.httpd.getAreas()

    this.allAreas.subscribe(data => {     
      this.areas = data.success
    })
  }

  areaSelected(area_){
    this.navCtrl.push('ProductsPage', {area: area_})
  }
      
}
