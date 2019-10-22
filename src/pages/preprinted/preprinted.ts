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

  allDuplicateds: any = []  
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
        console.log('Recebido sinal de pagamento com sucesso')
        this.cancelar()
      }); 
  }

  ngOnDestroy() {
    this.events.unsubscribe(this.dataInfo.eventPaymentOk);    
  }

  ionViewDidLoad() {    

    if(! this.dataInfo.isHome){
      this.navCtrl.setRoot('LoginPage')
    }
    else {

      this.cancelar()
      this.goBack()    
      this.totemWorking()
      this.setFocus()
      this.setIntervalFocus()    
      
      this.searchTicketStart = '19520001'
      this.searchTicketEnd = '19520005'
    }
    
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
    
    let total = this.searchTicket.length

    if(total == 8){

    let multi = this.allTickesSimpleList.includes(this.searchTicket)    
    console.log(this.allTickesSimpleList)
    
    if(! multi){
      
        if(this.allTickets.length === 0)
            this.searchOne()
        
        else 
          this.checkDigits()        
      }      
    }
    else if(total > 0){
      this.uiUtils.showAlert('Erro!', 'Código Incorreto').present()

      this.searchTicket = ''
    }
    else {     
      this.searchTicket = ''
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
      this.uiUtils.showAlert('Erro!', 'Bilhete não existe no estoque!').present()
      this.searchTicket = ''
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

    var bar = new Promise((resolve) => {

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
  
          console.log('Adicionando na lista UNICO: ', ticketNumberStr)        
  
          this.allTickesSimpleList.push(ticketNumberStr)
          this.allTickets.push(element)
  
          this.allTicketCart.push(element)        
  
        } else {
            vencidos.push(element.id_estoque_utilizavel)
        }
        
        resolve()

      });            
    });
    
    bar.then(() => {

      if(vencidos.length > 0){
        this.avisoIngressosVencidos(vencidos)
      }
  
      this.removeTicketDuplicated(vencidos)

    })
    
  }

  avisoIngressosVencidos(vencidos){
    this.searchTicket = ''
    let msg = "Bilhete(s) já vendidos: " + vencidos
    this.uiUtils.showAlert("Atenção", msg).present()
  }

  searchCallbackContinueMultiple(ticket){
    
    let el = {valorTotal: 0, ticketStart: 0, ticketEnd: 0, total: 0, valorTotalF: '', quantity: 0,
    selectedsIds: [], selectedsName: []}

    let items_ = []
    let vencidos = []
    this.allDuplicateds = []    

    var bar = new Promise((resolve) => {

    ticket.success.forEach(element => {

        if(! this.allDuplicateds.includes(element.id_estoque_utilizavel)){

          this.removeSingleCart(element)

          this.allDuplicateds.push(element.id_estoque_utilizavel)

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
    
            el.ticketStart = Number(this.searchTicketStart)
            el.ticketEnd = Number(this.searchTicketEnd)
            el.quantity =  1
            
            let ticketNumberStr = String(element.id_estoque_utilizavel)                             
            this.allTickesSimpleList.push(ticketNumberStr)            
            this.allTicketCart.push(el)

            this.valorTotal += element.valor_produto
            this.vendaLoteTipoTicket = element.nome_subtipo_produto
    
            items_.push(el)
            console.log('Adicionando na lista multiplo: ', ticketNumberStr)
          }
                  
          else {
            vencidos.push(element)
          } 
       }

       
    });

        console.log('this.allTicketCart', this.allTicketCart)
        resolve()
    }); 
    
    bar.then(() => {

      if(vencidos.length > 0){
        this.avisoIngressosVencidos(vencidos)
      }    
  
      this.allTicketsMultiple.push(el)    
      this.removeTicketDuplicated(vencidos)
      this.removeTicketDuplicated(items_)

    })        
  }

  removeTicketDuplicated(items_){

    return new Promise((resolve) => {

      for( var i = 0; i < items_.length; i++){       
      
        let ticket = items_[i]
        
        this.removeSingle(ticket)            
        //this.removeListMultiple(ticket)
      }   
      
      resolve()
    });
    
  }

  cancelar(){
    this.allTickesSimpleList = []
    this.allTickets = []
    this.allTicketsMultiple = []
    this.allTicketCart = []
    this.valorTotal = 0
    this.searchTicket = ''
    this.searchTicketStart = ''
    this.searchTicketEnd = ''
  }

  pagamento(){

    this.valorTotal = 0
    this.allDuplicateds = []

    let cart = []

    var bar = new Promise((resolve) => {

      this.allTicketCart.forEach(element => {      

        if(! this.allDuplicateds.includes(element.id_estoque_utilizavel))
        {
          this.valorTotal += element.valor_produto        
          this.allDuplicateds.push(element.id_estoque_utilizavel)
          cart.push(element)          
        }            
      });

      resolve()
    })
    

    bar.then(() => {

      this.allTicketCart = cart
    
      let data = {productSelected: this.allTicketCart, 
        totalSelected: this.valorTotal, finalValue: this.valorTotal, isPrePrinted: true}
      
      let modal = this.modalCtrl.create('PaymentPage', data);

      modal.present(); 

    })
    
    
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

    for(var ii = 0; ii < this.allTicketCart.length; ++ii){

      let product = this.allTicketCart[ii]
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

        for(var jj = 0; jj < selecteds.length; ++jj){

          let subselected = selecteds[jj];

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

    this.searchTicket = ''
  }

  removeCart(command){

    let ini = 0
    let fim = 0

    var bar = new Promise((resolve) => {

      for( var i = 0; i < this.allTicketCart.length; i++){ 
          
        let id_estoque_utilizavel = this.allTicketCart[i].id_estoque_utilizavel
        
        if(id_estoque_utilizavel === command.id_estoque_utilizavel){   
  
          let ticketStart = Number(this.allTicketCart[i].ticketStart)
          let ticketEnd = Number(this.allTicketCart[i].ticketEnd)
  
          if(ticketStart && ticketEnd){    
            ini = ticketStart
            fim = ticketEnd
          }
  
          else {            
            this.allTicketCart.splice(i, 1) 
          }        
        }                
      }

      resolve()
    });
    
    bar.then(() => {

      if(ini && fim){
          this.removeMultiploTry(ini, fim)         
          this.removeMultiploSimpleListTry(ini, fim)         
       }
    })   
 }


 removeMultiploTry(ini, fim){

  var bar1 = this.removeMultiploInicioFim(ini, fim)

  bar1.catch(() => {
   this.removeMultiploTry(ini, fim)
  })

 }

 removeMultiploInicioFim(ini, fim){

  return new Promise((resolve, reject) => {
    
    let totalFila = 0

    for( var j = 0; j < this.allTicketCart.length; j++){ 
        
      let id_estoque_utilizavel = this.allTicketCart[j].id_estoque_utilizavel

      if(id_estoque_utilizavel => ini && id_estoque_utilizavel <= fim){
        
        this.allTicketCart.splice(j, 1)
        totalFila++
      }
     }

     totalFila === 0 ? resolve() : reject()
    
   })
 }

 removeMultiploSimpleListTry(ini, fim){

  var bar1 = this.removeMultiploInicioFimSimples(ini, fim)

  bar1.catch(() => {   
   this.removeMultiploSimpleListTry(ini, fim)
  })

 }

 removeMultiploInicioFimSimples(ini, fim){

  return new Promise((resolve, reject) => {
    
    let totalFila = 0

    for( var j = 0; j < this.allTickesSimpleList.length; j++){ 
      
      let id_estoque_utilizavel = this.allTickesSimpleList[j].id_estoque_utilizavel

      if(id_estoque_utilizavel => ini && id_estoque_utilizavel <= fim){
        
        this.allTickesSimpleList.splice(j, 1)
        totalFila++
      }
     }

     totalFila === 0 ? resolve() : reject()
    
   })
 }

 removeSingle(command){

  return new Promise((resolve) => {

    let total = this.allTickets.length
    for( var j = 0; j < total; j++){ 
          
      let id_estoque_utilizavel = this.allTickets[j].id_estoque_utilizavel            
  
      if(id_estoque_utilizavel === command.id_estoque_utilizavel){            
        this.allTickets.splice(j, 1)
      }
    }

    resolve()

  })
  
 }

 removeListMultiple(command){

  var bar = new Promise((resolve) => {

    for( var m = 0; m < this.allTicketsMultiple.length; m++){ 
          
      let id_estoque_utilizavel = this.allTicketsMultiple[m].id_estoque_utilizavel            
  
      if(id_estoque_utilizavel === command.id_estoque_utilizavel){            
        this.allTicketsMultiple.splice(m, 1)
      }
     }
     
     resolve()
  })

  bar.then(() => {

    new Promise((resolve) => {

      for( var k = 0; k < this.allTickesSimpleList.length; k++){ 
          
        let id_estoque_utilizavel = Number(this.allTickesSimpleList[k])
    
        if(id_estoque_utilizavel === command.id_estoque_utilizavel){            
          this.allTickesSimpleList.splice(k, 1)
        }
      }

      resolve()

    })    
  })  
 }   

 removeSingleCart(command){

  return new Promise((resolve) => {

    for( var j = 0; j < this.allTicketCart.length; j++){ 
          
      let id_estoque_utilizavel = this.allTicketCart[j].id_estoque_utilizavel            
  
      if(id_estoque_utilizavel === command.id_estoque_utilizavel){            

        console.log('Removendo ÚNICO CART', id_estoque_utilizavel)
        this.allTicketCart.splice(j, 1)
        resolve()
      }
    }

    

  })
  
 }
 
}
