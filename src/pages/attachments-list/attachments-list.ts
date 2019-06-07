import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UiUtilsProvider } from '../../providers/ui-utils/ui-utils';
import { HttpdProvider } from '../../providers/httpd/httpd';
import { DataInfoProvider } from '../../providers/data-info/data-info';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment-timezone';
import { FormControl } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-attachments-list',
  templateUrl: 'attachments-list.html',
})
export class AttachmentsListPage {

  @ViewChild('inputSearch') inputSearch;

  products: Observable<any>;
  productsAll: any;
  dayBegin: string = "";
  dayEnd: string = ""

  searchTerm: string = '';
  searching: any = false;
  searchControl: FormControl;

  constructor(
    public navCtrl: NavController, 
    public dataInfo: DataInfoProvider,    
    public httpd: HttpdProvider,
    public uiUtils: UiUtilsProvider,
    public navParams: NavParams) {
      this.searchControl = new FormControl();

    this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
      this.searching = false;
    });  
      
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AttachmentsListPage');

    this.dayBegin = moment().startOf('day').format()      
    this.dayEnd = moment().endOf('day').format()

    console.log(this.dataInfo.userInfo.id_usuarios, this.dayBegin, this.dayEnd)

    this.products = this.httpd.getProductsAttachments(this.dataInfo.userInfo.id_usuarios, this.dayBegin, this.dayEnd)    
    this.products.subscribe(data => {
      this.loadData(data)

    })
  }

  loadData(data){
    data.success.forEach(element => {                        

      element.data_log_venda = moment(element.data_log_venda)
        .tz('America/Sao_Paulo').format("DD.MM.YYYY hh:mm:ss")
    });   
    
    this.productsAll = data.success
  }

  setFilteredItems(){
    this.productsAll = []

    this.httpd.getProductsAttachmentsName(this.dataInfo.userInfo.id_usuarios, this.dayBegin, this.dayEnd, this.searchTerm)
    this.products.subscribe(data => {
      this.loadData(data)
      
    })
  }  

}
