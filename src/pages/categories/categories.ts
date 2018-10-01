import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { HttpdProvider } from '../../providers/httpd/httpd';

@IonicPage()
@Component({
  selector: 'page-categories',
  templateUrl: 'categories.html',
})
export class CategoriesPage {

  allCategories: Observable<any>;

  constructor(public navCtrl: NavController,
    public httpd: HttpdProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CategoriesPage');

    this.startInterface()
  }

  startInterface(){
    this.allCategories = this.httpd.getCategories()

    this.allCategories.subscribe(data => {
      console.log(data)
    })
  }

}
