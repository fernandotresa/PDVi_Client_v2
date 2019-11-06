import { Component } from '@angular/core';
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
    this.status = this.payload.status === 1 ? "Ativo" : "Inativo"

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
    let alert = this.uiUtils.showConfirm("Atenção", "Deseja continuar com a edição?")
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
