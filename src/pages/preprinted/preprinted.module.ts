import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PreprintedPage } from './preprinted';

@NgModule({
  declarations: [
    PreprintedPage,
  ],
  imports: [
    IonicPageModule.forChild(PreprintedPage),
  ],
})
export class PreprintedPageModule {}
