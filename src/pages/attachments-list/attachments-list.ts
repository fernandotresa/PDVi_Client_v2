import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UiUtilsProvider } from '../../providers/ui-utils/ui-utils';
import { HttpdProvider } from '../../providers/httpd/httpd';
import { DataInfoProvider } from '../../providers/data-info/data-info';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment-timezone';

@IonicPage()
@Component({
  selector: 'page-attachments-list',
  templateUrl: 'attachments-list.html',
})
export class AttachmentsListPage {

  products: Observable<any>;
  dayBegin: string = "";
  dayEnd: string = ""

  constructor(
    public navCtrl: NavController, 
    public dataInfo: DataInfoProvider,    
    public httpd: HttpdProvider,
    public uiUtils: UiUtilsProvider,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AttachmentsListPage');

    this.dayBegin = moment().startOf('day').format()      
    this.dayEnd = moment().endOf('day').format()

    this.products = this.httpd.getProductsAttachments(this.dataInfo.userInfo.id_usuarios, this.dayBegin, this.dayEnd)
    
    this.products.subscribe(data => {

      this.loadData(data)
    })
  }

  loadData(data){

    console.log(data
      )
  }

}
