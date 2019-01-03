import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SubproductsPage } from './subproducts';

@NgModule({
  declarations: [
    SubproductsPage,
  ],
  imports: [
    IonicPageModule.forChild(SubproductsPage),
  ],
})
export class SubproductsPageModule {}
