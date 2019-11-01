import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SessionsAddPage } from './sessions-add';

@NgModule({
  declarations: [
    SessionsAddPage,
  ],
  imports: [
    IonicPageModule.forChild(SessionsAddPage),
  ],
})
export class SessionsAddPageModule {}
