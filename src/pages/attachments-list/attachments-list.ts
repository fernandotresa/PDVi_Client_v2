import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UiUtilsProvider } from '../../providers/ui-utils/ui-utils';
import { HttpdProvider } from '../../providers/httpd/httpd';
import { DataInfoProvider } from '../../providers/data-info/data-info';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment-timezone';
import { FormControl } from '@angular/forms';
import {Md5} from 'ts-md5/dist/md5';

@IonicPage()
@Component({
  selector: 'page-attachments-list',
  templateUrl: 'attachments-list.html',
})
export class AttachmentsListPage {

  @ViewChild('inputSearch') inputSearch;
  @ViewChild('inputPassword') inputPassword;
  @ViewChild('inputEnd') inputEnd;

  products: Observable<any>;
  productsAll: any;
  dayBegin: string = "";
  dayEnd: string = ""

  searchTerm: string = '';
  searching: any = false;
  searchControl: FormControl;

  supervisorAuthOk: Boolean = false
  supervisorPassword: string = ""
  supervisorUsername: string = ""
  supervisorId: number = 0    
  supervisorInfo: any = []  
  allSupervisors: Observable<any>;

  constructor(
    public navCtrl: NavController, 
    public dataInfo: DataInfoProvider,    
    public httpd: HttpdProvider,
    public uiUtils: UiUtilsProvider,
    public navParams: NavParams) {
      this.searchControl = new FormControl();

    this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
      this.searching = false;

      this.setFilteredItems()
    });  
      
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AttachmentsListPage');    

    this.getSupervisorInfo()
    this.dayBegin = moment().startOf('day').format()      
    this.dayEnd = moment().endOf('day').format()

    console.log(this.dataInfo.userInfo.id_usuarios, this.dayBegin, this.dayEnd)
  }

  getData(){
    this.products = this.httpd.getProductsAttachments(this.dataInfo.userInfo.id_usuarios, this.dayBegin, this.dayEnd)    
    this.products.subscribe(data => {
      this.loadData(data)
    })
  }  

  loadData(data){

    console.log(data.success)

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


  getSupervisorInfo(){
    
    this.supervisorAuthOk = false
    this.allSupervisors = this.httpd.getAuthSupervisor()

    this.allSupervisors
    .subscribe( data => {
        console.log(data)
        this.supervisorInfo = data.success
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
    console.log("Finish")        

    if(! this.checkSupervisorInfo())      
      this.uiUtils.showAlert(this.dataInfo.titleWarning, this.dataInfo.titleAuthError).present()

    else 
      this.supervisorAuthOk = true     
  }  

  focusPassword(){    
    this.inputPassword.setFocus()
  }


}
