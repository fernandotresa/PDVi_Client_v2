import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, Platform } from 'ionic-angular';
import { UiUtilsProvider } from '../../providers/ui-utils/ui-utils'
import { DataInfoProvider } from '../../providers/data-info/data-info'
import { HttpdProvider } from '../../providers/httpd/httpd'
import { StorageProvider } from '../../providers/storage/storage';
import { CameraProvider } from '../../providers/camera/camera'
import { Observable } from 'rxjs/Observable';
import {Md5} from 'ts-md5/dist/md5';

@IonicPage()
@Component({
  selector: 'page-users-add',
  templateUrl: 'users-add.html',
})
export class UsersAddPage {

  services: Observable<any>;
  payload: any

  key: string = ""
  name: string = ""
  password: string = ""
  password1: string = ""
  aclUser: string = ""
  base64Image: string = '';  
  
  selectedPhoto: any;
  photoChanged: Boolean = false

  allAcls: Observable<any>;
  allAclsArray: any = []

  constructor(public navCtrl: NavController, 
    public uiUtils: UiUtilsProvider,    
    public platform: Platform,
    public dataInfo: DataInfoProvider,
    public actionsheetCtrl: ActionSheetController,
    public camera: CameraProvider,    
    public storage: StorageProvider, 
    public httpd: HttpdProvider,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
    this.clear()  
    this.getAcls()
  }

  getAcls(){
    
    this.allAcls = this.httpd.getAcls()

    this.allAcls
    .subscribe( data => {
        console.log(data)
        this.allAclsArray = data.success
    }); 
  }      

  clear(){
    this.key = ""
    this.name = ""    
    this.password = ""
    this.password1 = ""
    this.base64Image = ""
  }  

  add(){


    this.addContinue("")

   /* if(this.base64Image.length === 0)
      this.uiUtils.showAlert("Atenção", "Favor anexar uma imagem para o tipo").present()          
    else
      this.uploadWithPic()*/
  } 

  uploadWithPic(){    
    
    let loading = this.uiUtils.showLoading("Favor aguarde")
    loading.present()

    this.storage.uploadPicture(this.base64Image)

      .then(snapshot => {

        snapshot.ref.getDownloadURL().then(url => {
          loading.dismiss()
          this.addContinue(url)
          

        }).catch(err => {
          loading.dismiss()
          this.uiUtils.showAlert("Erro!", err).present()
          
        })
      })
      .catch( error => {
        loading.dismiss()
        this.uiUtils.showAlert("Erro!", error).present()
      })        
  }  
  
  addContinue(url: string){

    if(this.password === this.password1){

      let passwd = Md5.hashStr(this.password);

      this.httpd.addUsers(this.name, passwd, this.aclUser)
        .subscribe( () => {
          this.uiUtils.showAlert("Sucesso", "Adicionado com sucesso!").present()
          this.navCtrl.pop()
        })
        
    }
    else {
      this.uiUtils.showAlert("Erro!", "Senhas não conferem").present()
    }
    
  }

  save(){

    let passwd = Md5.hashStr(this.password);

    this.httpd.saveUsers(this.key, this.name, passwd, this.aclUser)
    .subscribe( () => {

      this.uiUtils.showAlert("Sucesso", "Salvo com sucesso!").present()
      this.navCtrl.pop()
    })    
  } 

  goBack(){
    this.navCtrl.pop()
  }

  openMenu() {
    let actionSheet = this.actionsheetCtrl.create({
      title: 'Selecionar imagem',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Camera',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'camera' : null,
          handler: () => {
            this.handlerCamera()
          }
        },
        {
          text: 'Album',
          icon: !this.platform.is('ios') ? 'albums' : null,
          handler: () => {
            this.handlerGalery()
          }
        },       
        {
          text: 'Cancelar',
          role: 'cancel',
          icon: !this.platform.is('ios') ? 'close' : null
        }
      ]
      
    });
    actionSheet.present();
  }    

  handlerCamera(){
    if(! this.dataInfo.isWeb)
      this.grabPicture()
    else
      this.uiUtils.showAlert("Atenção", "Indisponível").present()
  }

  handlerGalery(){
    if(! this.dataInfo.isWeb)
      this.accessGallery()
    else
      this.uiUtils.showAlert("Atenção", "Indisponível").present()    
  }

  selectPicture(){
      this.openMenu()
  }  

  grabPicture() {
 
    let loading = this.uiUtils.showLoading('Aguarde')      
    loading.present();

    this.camera.grabPicture().then((imageData) => {
            
      this.selectedPhoto  = this.dataInfo.dataURItoBlob('data:image/jpeg;base64,' + imageData);                  
      this.base64Image = 'data:image/jpeg;base64,' + imageData
      this.photoChanged = true
      loading.dismiss()

    }, (err) => {
      loading.dismiss()
    });
   }

    onSuccess = (snapshot) => {        
    this.base64Image = snapshot.downloadURL;
  }
  
  onError = (error) => {
    console.log('error', error);
  }

  accessGallery(){    
     this.camera.getPicture().then((imageData) => {
      this.base64Image = 'data:image/jpeg;base64,' + imageData
      this.photoChanged = true

    }, (err) => {
     console.log(err);
    });
   }

  delPicture(){
    this.base64Image = ""
  }      

  picChange(event: any) {

    if(event.target.files && event.target.files[0]){
      let reader = new FileReader();

      reader.onload = (event:any) => {
        this.base64Image = event.target.result;
        this.photoChanged = true
      }
      reader.readAsDataURL(event.target.files[0]);
    }    
  }


  edit(data){
    console.log(data)
    this.key = data.payload.id
    this.name = data.payload.val().name    
    this.aclUser = data.payload.val().acl
    this.base64Image = data.payload.val().url    

  }


}
