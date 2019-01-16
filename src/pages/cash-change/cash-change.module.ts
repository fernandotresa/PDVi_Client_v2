import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CashChangePage } from './cash-change';

@NgModule({
  declarations: [
    CashChangePage,
  ],
  imports: [
    IonicPageModule.forChild(CashChangePage),
  ],
})
export class CashChangePageModule {}
