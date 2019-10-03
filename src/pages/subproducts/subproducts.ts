import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController, NavController } from 'ionic-angular';
import { DataInfoProvider } from '../../providers/data-info/data-info';
import { Observable } from 'rxjs/Observable';
import { HttpdProvider } from '../../providers/httpd/httpd';

@IonicPage()
@Component({
  selector: 'page-subproducts',
  templateUrl: 'subproducts.html',
})
export class SubproductsPage {


  productSelected: any;
  allSubtypes: Observable<any>;
  subtypes: any = []
  totalSelected: number = 0
  totalTickets: number = 0
  totalClicked: number = 0

  constructor(
    public navCtrl: NavController, 
    public dataInfo: DataInfoProvider,
    public httpd: HttpdProvider,
    public viewCtrl: ViewController,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    
    this.productSelected = this.navParams.get('productSelected') 
    this.totalSelected = this.productSelected.quantity    

    this.allSubtypes = this.httpd.getSubtypesProducts(this.productSelected.fk_id_tipo_produto)

    this.allSubtypes.subscribe(data => {            
      this.startInterface(data)
    })
  }

  startInterface(data){
    
    this.subtypes = data.success        
    let fk_id_subtipo_produto = this.productSelected.fk_id_subtipo_produto

    this.subtypes.forEach(element => {      

      if(element.id_subtipo_produto === fk_id_subtipo_produto)
          element.quantity = this.totalSelected    
          
    });

    this.totalTickets = this.totalSelected
  }

  selectedType(type){    
    this.productSelected.nome_subtipo_produto = type.nome_subtipo_produto
    this.productSelected.fk_id_subtipo_produto = type.id_subtipo_produto
    this.viewCtrl.dismiss(this.productSelected)
  }

  increment(type){

    if(type.quantity == undefined)
      type.quantity = 0
    
    if(this.totalTickets < this.totalSelected){           
      type.quantity++
      this.totalTickets++
    }    
  }

  decrement(type){
    if(type.quantity == undefined)
      type.quantity = 0

    if(type.quantity > 0){                 
      type.quantity--    
      this.totalTickets--           
    }    
  }
  
  finish(){    
    this.viewCtrl.dismiss({subtypes: this.subtypes, productS: this.productSelected});
  }

  goBack(){
    this.navCtrl.pop()
  }  

}
