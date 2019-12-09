import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UsersAddPage } from './users-add';

@NgModule({
  declarations: [
    UsersAddPage,
  ],
  imports: [
    IonicPageModule.forChild(UsersAddPage),
  ],
})
export class UsersAddPageModule {}
