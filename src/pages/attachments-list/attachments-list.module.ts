import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AttachmentsListPage } from './attachments-list';

@NgModule({
  declarations: [
    AttachmentsListPage,
  ],
  imports: [
    IonicPageModule.forChild(AttachmentsListPage),
  ],
})
export class AttachmentsListPageModule {}
