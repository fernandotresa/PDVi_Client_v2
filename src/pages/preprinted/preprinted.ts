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

  searchTicket: string = '';

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
        this.cancelar()
      }); 
  }

  ngOnDestroy() {
    this.events.unsubscribe(this.dataInfo.eventPaymentOk);    
  }

  ionViewDidLoad() {    
    
    this.cancelar()
    this.goBack()    
    this.totemWorking()
    this.setFocus()
    this.setIntervalFocus()      
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
    
    if(! this.allTickesSimpleList.includes(this.searchTicket)){

      if(this.searchTicket.length == 8){

        if(this.allTickets.length === 0)
            this.searchOne()
        
        else 
          this.checkDigits()        
      }
      else {
        this.uiUtils.showAlert('Erro!', 'Código Incorreto')
      }
    }         
  }

  checkDigits(){

    if(this.allTickets[this.allTickets.length-1]){
    
      let last = this.allTickets[this.allTickets.length-1].id_estoque_utilizavel
      let ini = String(last).substring(0,2)      
      let fim = this.searchTicket.substring(0,2)      

      if(ini === fim)
          this.checkTicketDifference()
      else 
        this.searchOne()      
    } 

    else {
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
    
    this.uiUtils.showToast('Verificando ingresso: ' + this.searchTicket)
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

    this.uiUtils.showConfirm('Venda Múltipla', msg)
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
      this.uiUtils.showAlert('Erro!', 'Bilhetenão existe no estoque!').present()
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

    let vencidos = []

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

      } else {
          vencidos.push(element.id_estoque_utilizavel)
      }        
    });
    
    if(vencidos.length > 0){
      this.avisoIngressosVencidos(vencidos)
    }
  }

  avisoIngressosVencidos(vencidos){
    let msg = "Ingressos já vendido: " + vencidos
    this.uiUtils.showAlert("Atenção", msg).present()
  }

  searchCallbackContinueMultiple(ticket){
    
    let el = {valorTotal: 0, ticketStart: '', ticketEnd: '', total: 0, valorTotalF: '', quantity: 0,
    selectedsIds: [], selectedsName: []}

    let items_ = []
    let vencidos = []

    ticket.success.forEach(element => {

      if(element.data_log_venda == undefined){

        el = element
        el.total = ticket.success.length  

        el.valorTotal = 0
        el.valorTotal += element.valor_produto * el.total
        element.quantity = ticket.success.length  

        el.selectedsIds = []
        el.selectedsName = []

        el.selectedsIds.push(element.id_subtipo_produto)
        el.selectedsName.push(element.nome_subtipo_produto)

        el.valorTotalF = el.valorTotal.toFixed(2)

        el.ticketStart = this.searchTicketStart
        el.ticketEnd = this.searchTicketEnd 
        el.quantity =  1

        this.allTicketCart.push(el)
        this.valorTotal += element.valor_produto
        this.vendaLoteTipoTicket = element.nome_subtipo_produto

        items_.push(el)
      }
              
      else {
        vencidos.push(element.id_estoque_utilizavel)
    } 

    });            

    if(vencidos.length > 0){
      this.avisoIngressosVencidos(vencidos)
    }    

    this.allTicketsMultiple.push(el)    

    this.removeTicketDuplicated(items_)  
  }

  removeTicketDuplicated(items_){

    for( var i = 0; i < items_.length; i++){       
      
      let ticket = items_[i]
      //this.removeCart(ticket)
      this.removeSingle(ticket)          
    }    
  }

  cancelar(){
    this.allTickesSimpleList = []
    this.allTickets = []
    this.allTicketsMultiple = []
    this.valorTotal = 0
    this.searchTicket = ''
    this.searchTicketStart = ''
    this.searchTicketEnd = ''
  }

  pagamento(){

    this.valorTotal = 0
    let dup = []
    let cart = []

    this.allTicketCart.forEach(element => {
      console.log('element.valor_produto', element.id_estoque_utilizavel, element.valor_produto)

      if(! dup.includes(element.id_estoque_utilizavel)){
        this.valorTotal += element.valor_produto
        dup.push(element.id_estoque_utilizavel)
        cart.push(element)
        
      }            
    });

    this.allTicketCart = cart
    console.log(cart)
    
    let data = {productSelected: this.allTicketCart, 
      totalSelected: this.valorTotal, finalValue: this.valorTotal, isPrePrinted: true}
    
    let modal = this.modalCtrl.create('PaymentPage', data);

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

      if(quantity > 0){
        productS.nome_subtipo_produto = subtype.nome_subtipo_produto
        subtypesquantities.push(subtype)
      }    
        
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

    for(var i = 0; i < this.allTickets.length; ++i){
      let product = this.allTickets[i]

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
    this.uiUtils.showConfirm(this.dataInfo.titleAtention, 'Deseja remover o item de venda?')
    .then(res => {
      if(res){
        this.removeContinue(command)
      }
    })    
  }

  removeContinue(command){        
    this.removeCart(command)
    this.removeSingle(command)                    
    this.removeListMultiple(command)

  }

  removeCart(command){
    for( var i = 0; i < this.allTicketCart.length; i++){ 
          
      let id_estoque_utilizavel = this.allTicketCart[i].id_estoque_utilizavel            

      if(id_estoque_utilizavel === command.id_estoque_utilizavel){   
        console.log('Removendo Cart: ', id_estoque_utilizavel)  
        this.allTicketCart.splice(i, 1)
      }
   }       
 }

 removeSingle(command){
  for( var j = 0; j < this.allTickets.length; j++){ 
          
    let id_estoque_utilizavel = this.allTickets[j].id_estoque_utilizavel            

    if(id_estoque_utilizavel === command.id_estoque_utilizavel){            
      this.allTickets.splice(j, 1)
    }
  }
 }

 removeListMultiple(command){

  for( var m = 0; m < this.allTicketsMultiple.length; m++){ 
          
    let id_estoque_utilizavel = this.allTicketsMultiple[m].id_estoque_utilizavel            

    if(id_estoque_utilizavel === command.id_estoque_utilizavel){            
      this.allTicketsMultiple.splice(m, 1)
    }
   }     

  for( var k = 0; k < this.allTickesSimpleList.length; k++){ 
          
    let id_estoque_utilizavel = Number(this.allTickesSimpleList[k])

    if(id_estoque_utilizavel === command.id_estoque_utilizavel){            
      this.allTickesSimpleList.splice(k, 1)
    }
  }
 }

 

  

 
}
