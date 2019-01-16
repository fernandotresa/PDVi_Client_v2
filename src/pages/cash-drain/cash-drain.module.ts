import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CashDrainPage } from './cash-drain';

@NgModule({
  declarations: [
    CashDrainPage,
  ],
  imports: [
    IonicPageModule.forChild(CashDrainPage),
  ],
})
export class CashDrainPageModule {}
