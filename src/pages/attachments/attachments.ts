import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { UiUtilsProvider } from '../../providers/ui-utils/ui-utils'
import { DataInfoProvider } from '../../providers/data-info/data-info'

@IonicPage()

@Component({
  selector: 'page-attachments',
  templateUrl: 'attachments.html',
})
export class AttachmentsPage {

  base64Image1: string = '';
  selectedPhoto1: any;
  urlPicture1: string = ""

  base64Image2: string = '';
  selectedPhoto2: any;
  urlPicture2: string = ""

  base64Image3: string = '';
  selectedPhoto3: any;
  urlPicture3: string = ""

  base64Image4: string = '';
  selectedPhoto4: any;
  urlPicture4: string = ""

  base64Image5: string = '';
  selectedPhoto5: any;
  urlPicture5: string = ""

  photoChanged: Boolean = false

  constructor(
    public navCtrl: NavController,
    public dataInfo: DataInfoProvider, 

    public uiUtils: UiUtilsProvider,
    public storage: StorageProvider, 
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AttachmentsPage');
  }

  goBack(){
    this.navCtrl.pop()
  }

  picChange1(event: any) {

    if(event.target.files && event.target.files[0]){
      let reader = new FileReader();

      reader.onload = (event:any) => {
        this.base64Image1 = event.target.result;
        this.photoChanged = true

        this.uploadPicture1()
      }
      reader.readAsDataURL(event.target.files[0]);
    }    
  }

  picChange2(event: any) {

    if(event.target.files && event.target.files[0]){
      let reader = new FileReader();

      reader.onload = (event:any) => {
        this.base64Image2 = event.target.result;
        this.photoChanged = true

        this.uploadPicture2()
      }
      reader.readAsDataURL(event.target.files[0]);
    }    
  }

  picChange3(event: any) {

    if(event.target.files && event.target.files[0]){
      let reader = new FileReader();

      reader.onload = (event:any) => {
        this.base64Image3 = event.target.result;
        this.photoChanged = true

        this.uploadPicture3()
      }
      reader.readAsDataURL(event.target.files[0]);
    }    
  }

  picChange4(event: any) {

    if(event.target.files && event.target.files[0]){
      let reader = new FileReader();

      reader.onload = (event:any) => {
        this.base64Image4 = event.target.result;
        this.photoChanged = true

        this.uploadPicture4()
      }
      reader.readAsDataURL(event.target.files[0]);
    }    
  }

  picChange5(event: any) {

    if(event.target.files && event.target.files[0]){
      let reader = new FileReader();

      reader.onload = (event:any) => {
        this.base64Image5 = event.target.result;
        this.photoChanged = true

        this.uploadPicture5()
      }
      reader.readAsDataURL(event.target.files[0]);
    }    
  }
   

 uploadPicture1(){
    let loading = this.uiUtils.showLoading("Enviando imagem 1. Favor aguarde.")

    this.storage.uploadPicture(this.base64Image1)

      .then(snapshot => {

        snapshot.ref.getDownloadURL().then(url => {
          this.urlPicture1 = url
          loading.dismiss()
          this.uiUtils.showAlertSuccess()

        }).catch(err => {
          loading.dismiss()
          this.uiUtils.showAlert("Erro ao enviar", err).present()
          
        })
      })
      .catch( error => {
        loading.dismiss()
        this.uiUtils.showAlert("Erro ao enviar", error).present()
      })  
  }

  uploadPicture2(){
    let loading = this.uiUtils.showLoading("Enviando imagem 2. Favor aguarde.")

    this.storage.uploadPicture(this.base64Image2)

      .then(snapshot => {

        snapshot.ref.getDownloadURL().then(url => {
          this.urlPicture2 = url
          loading.dismiss()
          this.uiUtils.showAlertSuccess()

        }).catch(err => {
          loading.dismiss()
          this.uiUtils.showAlert("Erro ao enviar", err).present()
          
        })
      })
      .catch( error => {
        loading.dismiss()
        this.uiUtils.showAlert("Erro ao enviar", error).present()
      })  
  }

  uploadPicture3(){
    let loading = this.uiUtils.showLoading("Enviando imagem 3. Favor aguarde.")

    this.storage.uploadPicture(this.base64Image1)

      .then(snapshot => {

        snapshot.ref.getDownloadURL().then(url => {
          this.urlPicture1 = url
          loading.dismiss()
          this.uiUtils.showAlertSuccess()

        }).catch(err => {
          loading.dismiss()
          this.uiUtils.showAlert("Erro ao enviar", err).present()
          
        })
      })
      .catch( error => {
        loading.dismiss()
        this.uiUtils.showAlert("Erro ao enviar", error).present()
      })  
  }

  uploadPicture4(){
    let loading = this.uiUtils.showLoading("Enviando imagem 4. Favor aguarde.")

    this.storage.uploadPicture(this.base64Image4)

      .then(snapshot => {

        snapshot.ref.getDownloadURL().then(url => {
          this.urlPicture4 = url
          loading.dismiss()
          this.uiUtils.showAlertSuccess()

        }).catch(err => {
          loading.dismiss()
          this.uiUtils.showAlert("Erro ao enviar", err).present()
          
        })
      })
      .catch( error => {
        loading.dismiss()
        this.uiUtils.showAlert("Erro ao enviar", error).present()
      })  
  }

  uploadPicture5(){
    let loading = this.uiUtils.showLoading("Enviando imagem 5. Favor aguarde.")

    this.storage.uploadPicture(this.base64Image5)

      .then(snapshot => {

        snapshot.ref.getDownloadURL().then(url => {
          this.urlPicture5 = url
          loading.dismiss()
          this.uiUtils.showAlertSuccess()

        }).catch(err => {
          loading.dismiss()
          this.uiUtils.showAlert("Erro ao enviar", err).present()
          
        })
      })
      .catch( error => {
        loading.dismiss()
        this.uiUtils.showAlert("Erro ao enviar", error).present()
      })  
  }
  
}
