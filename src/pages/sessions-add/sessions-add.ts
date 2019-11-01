import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
  tiposProdutos: string = ''

  payload: any
  isDuplicate: Boolean = false

  constructor(public navCtrl: NavController, 
    public uiUtils: UiUtilsProvider,
    public http: HttpdProvider,
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
    this.productsTypes = this.http.getProductsTypes()
    
    this.productsTypes.subscribe( data => {      
      this.carregaTiposContinue(data)
    })
  }

  carregaTiposContinue(data){
    
    this.productsTypesArray = []

    data.success.forEach(element => {
      console.log(element) 
      this.productsTypesArray.push(element) 
    });
  }


  load(){
    console.log(this.payload)
    this.nome = this.payload.nome
    this.obs = this.payload.obs
    
    this.tiposProdutos = this.payload.tiposProdutos
  }

  copy(){
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
    console.log(info)

    this.http.addSession(info)

    .subscribe( () =>{                      
        loading.dismiss()
        this.navCtrl.pop()
        this.uiUtils.showAlertSuccess()
        this.clear()
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

    let info = {id: this.payload.id_tipo_produto, 
      nome: this.nome, tipos: this.tiposProdutos, status: this.status, obs: this.obs, lotacao: this.lotacao}

    console.log(info)

    this.http.updateSession(info)

    .subscribe( () =>{
        loading.dismiss()
        this.clear()
        this.navCtrl.pop()
        this.uiUtils.showAlertSuccess()

      })
  }
 
}
