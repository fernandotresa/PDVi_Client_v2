import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { UiUtilsProvider } from '../../providers/ui-utils/ui-utils'
import { HttpdProvider } from '../../providers/httpd/httpd';
import { DataInfoProvider } from '../../providers/data-info/data-info'
import { Observable } from 'rxjs/Observable'

@IonicPage()
@Component({
  selector: 'page-sessions-add',
  templateUrl: 'sessions-add.html',
})
export class SessionsAddPage {
  @ViewChild('inputName') inputName;
  @ViewChild('inputStatus') inputStatus;
  @ViewChild('inputProdutos') inputProdutos;
  @ViewChild('inputLotacao') inputLotacao;
  @ViewChild('inputObs') inputObs;

  

  productsTypes: Observable<any>;
  productsTypesArray: any
 
  nome: string = ''
  status: string = 'Ativo'
  obs: string = ''  
  lotacao: string = ''  
  tiposProdutos: any

  payload: any
  isDuplicate: Boolean = false

  constructor(public navCtrl: NavController, 
    public uiUtils: UiUtilsProvider,
    public http: HttpdProvider,
    public events: Events,
    public dataInfo: DataInfoProvider,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
      this.startInteface()    
  }

  ngOnDestroy(){    
    //this.events.unsubscribe('company:edit')  
  }

  onNameKeydown(){

    if(this.inputStatus)
      this.inputStatus.open()
  }

  onStatusKeydown(event){

    this.status = event

    if(this.inputProdutos)
      this.inputProdutos.open()
  }

  onProdutosKeydown(){

    if(this.inputLotacao)
      this.inputLotacao.setFocus()
  }

  onLotacaoKeydown(){

    if(this.inputObs)
      this.inputObs.setFocus()
  }

  onObsKeydown(){

    if(this.nome && this.status && this.tiposProdutos && this.lotacao){

      if(this.payload)
        this.save()
      else
        this.add()
    }
    
  }

  startInteface(){
    this.payload = this.navParams.get('payload')
    this.isDuplicate = this.navParams.get('isDuplicate')

    this.productsTypesArray = []
    this.carregaTipos()

    if(this.payload){

      if(this.isDuplicate)
        this.copy()
      else
        this.load()
    }
    
    setTimeout(() => {
      console.log('Setando focus')
      this.inputName.setFocus();
    },1000);

  }

  carregaTipos(){

    let loading = this.uiUtils.showLoading("Carregando tipos")
    loading.present()

    this.productsTypes = this.http.getProducts()
    
    this.productsTypes.subscribe( data => {      
      this.carregaTiposContinue(data)
      loading.dismiss()
    })
  }

  carregaTiposContinue(data){
    
    this.productsTypesArray = []

    data.success.forEach(element => {
      this.productsTypesArray.push(element) 
    });

    if(this.payload)
      this.getSessionTypes()
  }

  load(){
    this.nome = this.payload.nome
    this.obs = this.payload.obs
    this.lotacao = this.payload.lotacao
    this.status = this.payload.status    

  }

  getSessionTypes(){
  
    this.http.getSessionsProducts(this.payload.id)
    
    .subscribe( data => {          
      
      this.getSessionProductCallback(data)
    })
  }

  getSessionProductCallback(data){
    
    let tipos = []

    data.success.forEach(element => {      
      tipos.push(element.nome_produto)        
    });

    this.tiposProdutos = tipos
  }

  copy(){
    this.load()
    this.nome = this.payload.nome + ' Cópia'
    this.obs = this.payload.obs + ' Cópia'

  }
 
  clear(){
    this.nome = ''
    this.obs = ''
  }

  add(){
    let alert = this.uiUtils.showConfirm("Atenção", "Deseja continuar com o cadastro?")  
      alert.then((result) => {

      if(result)  
        this.addContinue()          
    })    
  }

  addContinue(){
    let loading = this.uiUtils.showLoading("Favor aguarde")
    loading.present()
    
    let info = {nome: this.nome, tipos: this.tiposProdutos, status: this.status, obs: this.obs, lotacao: this.lotacao}

    this.http.addSession(info)

    .subscribe( callback =>{    

        loading.dismiss()

        if(callback){

          this.events.publish('atualiza-sessoes', true)
          this.navCtrl.pop()
          this.uiUtils.showAlertSuccess()
          this.clear()
        }
        else {
          this.uiUtils.showAlert('Erro!', 'Falha ao adicionar')
        }
        
      })
  }

  save(){
    let alert = this.uiUtils.showConfirm("Atenção", "Deseja alterar informações da sessão?")
    alert.then((result) => {

    if(result)  
      this.update()    
     })        
  }

  update(){

    if(this.isDuplicate){
        this.addContinue()
    } else {
        this.updateContinue()    
      }
    }

  updateContinue(){
    let loading = this.uiUtils.showLoading("Favor aguarde")
    loading.present()    

    let info = {id: this.payload.id, 
      nome: this.nome, tipos: this.tiposProdutos, status: this.status, obs: this.obs, lotacao: this.lotacao}

    this.http.updateSession(info)

    .subscribe( () =>{
        loading.dismiss()
        this.clear()

        this.events.publish('atualiza-sessoes', true)
        this.navCtrl.pop()
        this.uiUtils.showAlertSuccess()

      })
  }
 
}
