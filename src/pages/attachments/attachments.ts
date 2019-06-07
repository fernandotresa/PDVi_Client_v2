import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { UiUtilsProvider } from '../../providers/ui-utils/ui-utils'
import { DataInfoProvider } from '../../providers/data-info/data-info'

@IonicPage()

@Component({
  selector: 'page-attachments',
  templateUrl: 'attachments.html',
})
export class AttachmentsPage {

  products: any;
  productsNames: any = []
  productsImages: any = []
  productsUrls: any = []  
  productsQuantity: number = 0

  constructor(
    public dataInfo: DataInfoProvider, 
    public viewCtrl: ViewController,
    public uiUtils: UiUtilsProvider,
    public storage: StorageProvider, 
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AttachmentsPage');

    this.products = this.navParams.get('product')
    this.productsNames = this.products.selectedsName
    this.productsUrls = []
    this.productsQuantity = this.products.quantity
  }

  goBack(){
    this.products.urls = this.productsUrls
    this.viewCtrl.dismiss({products: this.products });
  }

  picChange(event: any) {

    if(event.target.files && event.target.files[0]){
      let reader = new FileReader();

      reader.onload = (event:any) => {

        let image = event.target.result;
        this.productsImages.push(image)
               
      }
      reader.readAsDataURL(event.target.files[0]);
    }    
  }  

upload(image: string){

  return this.storage.uploadPicture(image)

      .then(snapshot => {

        snapshot.ref.getDownloadURL().then(url => {
          console.log(url)
          this.productsUrls.push(url)
          

        }).catch(err => {
         console.log(err)
          
        })
      })
      .catch( error => {
        console.log(error)
      })
  }    

  uploadAll(){

    let loading = this.uiUtils.showLoading(this.dataInfo.titlePleaseWait)
    loading.present()

    let promises = []

    this.productsImages.forEach(element => {

        promises.push(this.upload(element))
      });

    Promise.all(promises)
    .then( () => {

      loading.dismiss()

      this.uiUtils.showAlertSuccess()

      .then( () => {  
        this.goBack()
      })
    })
    .catch( () => {
      this.uiUtils.showAlert(this.dataInfo.titleWarning, this.dataInfo.titleUploadFail).present()
    });
    
  }

 
  
}
