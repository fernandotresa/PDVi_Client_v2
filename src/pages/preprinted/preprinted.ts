import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ModalController} from 'ionic-angular';
import { HttpdProvider } from '../../providers/httpd/httpd';
import { DataInfoProvider } from '../../providers/data-info/data-info'
import { UiUtilsProvider } from '../../providers/ui-utils/ui-utils'
//import moment from 'moment';

@IonicPage()

@Component({
  selector: 'page-preprinted',
  templateUrl: 'preprinted.html',
})

export class PreprintedPage {
  @ViewChild('searchbar') searchbar;

  areaId: number = this.dataInfo.areaId
  pontoId: number = this.dataInfo.totemId  
  inputVisible: Boolean = true
  isLoading: Boolean = true  

  allTickets: any = []  
  allTicketsMultiple: any = []  
  allTicketCart: any = []
  allTickesSimpleList: any = []

  searchTicket: string = '19503001';
  searchTicketStart: string = '';
  searchTicketEnd: string = '';
 
  isVendaLote: Boolean = false
  vendaLoteTipoTicket: string = 'Inteira'

  valorTotal: number = 0  


  constructor(public dataInfo: DataInfoProvider,
    public navCtrl: NavController,
    public uiUtils: UiUtilsProvider,     
    public navParams: NavParams,  
    public events: Events,
    public modalCtrl: ModalController,
    public http: HttpdProvider) {      

      this.events.subscribe(this.dataInfo.eventPaymentOk, data => {       
        this.search() 
        this.cancelar()
      }); 
  }

  ngOnDestroy() {
    this.events.unsubscribe(this.dataInfo.eventPaymentOk);    
  }

  ionViewDidLoad() {    
    
    this.searchTicket = '19503001'
    this.goBack()    
    this.totemWorking()
    this.setFocus()
    this.setIntervalFocus()  

    this.allTickets = []
    this.allTicketsMultiple = []
  }    

  goBack(){    
    let self = this

    setTimeout(function(){ 

      if(self.searchTicket.length == 0){
        self.navCtrl.popToRoot()
      }                 
      
    }, 5000); 
  }

  setIntervalFocus(){
    let self = this

      setInterval(function(){ 

        if(self.searchTicket.length < 8)
            self.setFocus();        
      
      }, 1000);      
  }

  
  totemWorking(){
    this.inputVisible = true    
    this.isLoading = false
  }

  totemNotWorking(){
    this.inputVisible = false
    this.isLoading = true
  }


  setFocus(){
    if(this.searchbar)
      this.searchbar.setFocus();
  }
 
 
  search(){

    console.log('??? Procurando: ', this.searchTicket, this.allTickets.includes(this.searchTicket), this.allTickesSimpleList )
    
    if(! this.allTickesSimpleList.includes(this.searchTicket)){

      if(this.searchTicket.length == 8){

        if(this.allTickets.length === 0)
            this.searchOne()
        
        else 
          this.checkDigits()
        
      }
    }         
  }

  checkDigits(){

    if(this.allTickets[this.allTickets.length-1]){
    
      let last = this.allTickets[this.allTickets.length-1].id_estoque_utilizavel

      let ini = String(last).substring(0,2)
      
      let fim = this.searchTicket.substring(0,2)

      console.log(last, this.searchTicket, ini, fim)

      if(ini === fim)
          this.checkTicketDifference()
      else 
        this.searchOne()
      

    } 

    else {
      console.log('Array não possui último item')
      this.searchOne()
    }

  }

  checkTicketDifference(){

    let last = this.allTickets[this.allTickets.length-1].id_estoque_utilizavel
    let now = Number(this.searchTicket)    

    if(now - last > 3){
      
      this.searchTicketStart = last
      this.searchTicketEnd = this.searchTicket
      this.askSearchMultiples()
    }
          
    else  
      this.searchOne()
  }

  searchOne(){
    
    this.uiUtils.showToast('Iniciando verificação do ingresso: ' + this.searchTicket)
    this.isLoading = true

    this.http.checkTicket(this.searchTicket)
    .subscribe( data => {  

        this.searchTicketStart = ''
        this.searchTicketEnd = ''
        this.searchCallback(data)
    });      
  }

  askSearchMultiples(){

    let msg = 'Deseja inserir Múltiplos desta sequência? De ' + this.searchTicketStart + ' até ' + this.searchTicketEnd

    this.uiUtils.showConfirm(this.dataInfo.titleAtention, msg)
    .then(res => {

      if(res){
        this.searchMultipleTickets()
      }
      else
        this.searchOne()
    })    
  }

  searchMultipleTickets(){
    
    this.uiUtils.showToast('Iniciando verificação')
    this.isLoading = true

    this.http.checkMultipleTickets(this.searchTicketStart, this.searchTicketEnd)
    .subscribe( data => {  
        this.searchCallback(data)
    });      
  }

  searchCallback(ticket){    

    if(ticket.success.length == 0)
      this.searchCallbackNone()    

    else 
      this.searchCallbackContinue(ticket) 
  }


  searchCallbackNone(){
      this.uiUtils.showAlert('Atenção', 'Nenhum resultado').present()
      this.totemWorking()
  }

  searchCallbackContinue(ticket){    
   
    if(this.searchTicketStart.length === 0){      
      this.searchCallbackContinueOne(ticket)
    }
        
    else    
      this.searchCallbackContinueMultiple(ticket)
          
    this.totemWorking()
  }

  searchCallbackContinueOne(ticket){
    ticket.success.forEach(element => {      

      if(element.data_log_venda == undefined){
        
        element.quantity = ticket.success.length  
        element.selectedsIds = []
        element.selectedsName = []     
        
        element.selectedsIds.push(element.id_subtipo_produto)
        element.selectedsName.push(element.nome_subtipo_produto)

        this.valorTotal += element.valor_produto        
        this.vendaLoteTipoTicket = element.nome_subtipo_produto

        let ticketNumberStr = String(element.id_estoque_utilizavel)        

        this.allTickesSimpleList.push(ticketNumberStr)
        this.allTickets.push(element)
        this.allTicketCart.push(element)        
      }        
    });                
  }

  searchCallbackContinueMultiple(ticket){
    
    let el = {valorTotal: 0, ticketStart: '', ticketEnd: '', total: 0, valorTotalF: '', quantity: 0}
    let items_ = []

    ticket.success.forEach(element => {

      if(element.data_log_venda == undefined){

        el = element
        el.total = ticket.success.length     

        el.valorTotal = 0
        el.valorTotal += element.valor_produto * el.total
        el.quantity = ticket.success.length

        el.valorTotalF = el.valorTotal.toFixed(2)

        el.ticketStart = this.searchTicketStart
        el.ticketEnd = this.searchTicketEnd 
        el.quantity =  ticket.success.length

        items_.push(el)

        this.allTicketCart.push(el)
      }        

    });            

    this.allTicketsMultiple.push(el)    
    this.removeTicketDuplicated(items_)
  }

  removeTicketDuplicated(items_){

    for( var i = 0; i < items_.length; i++){ 
      
      for( var j = 0; j < this.allTickets.length; j++){ 
          
          let val1 = items_[i].id_estoque_utilizavel
          let val2 = this.allTickets[j].id_estoque_utilizavel            

          if(val1 === val2){            
            this.allTickets.splice(j, 1)
          }
       }
    }
  }

  cancelar(){
    this.allTickesSimpleList = []
    this.allTickets = []
    this.allTicketsMultiple = []
    this.valorTotal = 0
    this.searchTicketStart = ''
    this.searchTicketEnd = ''
  }

  pagamento(){
   
    let modal = this.modalCtrl.create('PaymentPage', {productSelected: this.allTicketCart, 
      totalSelected: this.valorTotal, finalValue: this.valorTotal});

    modal.present(); 
    
  }

  presentModal(product){    

    let modal = this.modalCtrl.create('SubproductsPage', {productSelected: product});
    modal.onDidDismiss(data => {
      
      if(data)
        this.searchProductSubtypeQuantity(data);
    });
    
    modal.present();
  }

  searchProductSubtypeQuantity(data){    
    
    let subtypes = data.subtypes       
    let productS = data.productS       

    let subtypesquantities = [] 

    for(var i = 0; i < subtypes.length; ++i){
      let subtype = subtypes[i]

      let quantity = subtype.quantity

      if(quantity > 0)            
        subtypesquantities.push(subtype)
    }
    
    this.searchProductSubtype(subtypesquantities, productS)
  }

  searchProductSubtype(selecteds, productS){    
  
    let id_produto = productS.id_produto    

    for(var i = 0; i < this.allTicketCart.length; ++i){
      let product = this.allTicketCart[i]

      let product_id_produto = product.id_produto      
      
      if(id_produto === product_id_produto){

        product.selectedsIds = []
        product.selectedsName = []

        for(var j = 0; j < selecteds.length; ++j){

          let subselected = selecteds[j];

          product.selectedsIds.push(subselected.id_subtipo_produto)
          product.selectedsName.push(subselected.nome_subtipo_produto)
        }
      }
    }    
  }

  remove(command){
    this.uiUtils.showConfirm(this.dataInfo.titleAtention, 'Deseja remover?')
    .then(res => {
      if(res){
        this.removeContinue(command)
      }
    })    
  }

  removeContinue(command){    

    console.log('removeContinue ', command)

    for( var i = 0; i < this.allTicketCart.length; i++){ 
          
      let id_estoque_utilizavel = this.allTicketCart[i].id_estoque_utilizavel            

      if(id_estoque_utilizavel === command.id_estoque_utilizavel){            
        this.allTicketCart.splice(i, 1)
      }
   }    

    for( var j = 0; j < this.allTickets.length; j++){ 
          
      let id_estoque_utilizavel = this.allTickets[j].id_estoque_utilizavel            

      if(id_estoque_utilizavel === command.id_estoque_utilizavel){            
        this.allTickets.splice(j, 1)
      }
   }      

   for( var k = 0; k < this.allTickesSimpleList.length; k++){ 
          
    let id_estoque_utilizavel = Number(this.allTickesSimpleList[k])

    if(id_estoque_utilizavel === command.id_estoque_utilizavel){            
      this.allTickesSimpleList.splice(k, 1)
    }
  }
  
  for( var m = 0; m < this.allTicketsMultiple.length; m++){ 
          
    let id_estoque_utilizavel = this.allTicketsMultiple[m].id_estoque_utilizavel            
    console.log(id_estoque_utilizavel)

    if(id_estoque_utilizavel === command.id_estoque_utilizavel){            
      this.allTicketsMultiple.splice(m, 1)
    }
 }   

 }

 

  

 
}
