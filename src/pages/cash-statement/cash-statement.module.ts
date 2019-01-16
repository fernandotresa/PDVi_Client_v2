import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CashStatementPage } from './cash-statement';

@NgModule({
  declarations: [
    CashStatementPage,
  ],
  imports: [
    IonicPageModule.forChild(CashStatementPage),
  ],
})
export class CashStatementPageModule {}
