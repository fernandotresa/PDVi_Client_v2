import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import * as moment from 'moment-timezone';


@Injectable()
export class StorageProvider {

  picturePath: string;
  client: string;  
  pathFinal: string;

  constructor() {
    console.log('Hello StorageProvider Provider');

      this.picturePath =  this.getPath() + '.jpg'
    this.pathFinal = '/fotos/'
  }

  getUploadedPhotoUrl() {
    return firebase.storage().ref(this.pathFinal).child(this.picturePath).getDownloadURL()     
  }  

  uploadPicture(selected) {
    return firebase.storage().ref(this.pathFinal).child(this.picturePath).putString(selected, 'data_url')
  }
  
  removePicture(url) {    
     console.log(url)
     return firebase.storage().ref(this.pathFinal).child(url).delete()
  }
  


  getPath(){
    let now = moment().format("YYYYMMDDhhmmSSSS")
    return now
  }

  

}