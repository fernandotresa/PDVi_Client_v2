import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SupervisorPage } from './supervisor';

@NgModule({
  declarations: [
    SupervisorPage,
  ],
  imports: [
    IonicPageModule.forChild(SupervisorPage),
  ],
})
export class SupervisorPageModule {}
