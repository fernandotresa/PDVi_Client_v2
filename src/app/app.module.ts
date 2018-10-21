import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { CategoriesPageModule } from '../pages/categories/categories.module';
import { HistoryPageModule } from '../pages/history/history.module';
import { SettingsPageModule } from '../pages/settings/settings.module';
import { TicketsPageModule } from '../pages/tickets/tickets.module';

import { HttpdProvider } from '../providers/httpd/httpd';
import { HttpClientModule } from '@angular/common/http';
import { UiUtilsProvider } from '../providers/ui-utils/ui-utils';
import { DataInfoProvider } from '../providers/data-info/data-info';

@NgModule({
  declarations: [
    MyApp,    
    HomePage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    
    HomePage,
    TabsPage
  ],
  exports: [
    CategoriesPageModule,    
    HistoryPageModule,
    SettingsPageModule,
    TicketsPageModule
  ],
  providers: [    
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    HttpdProvider,
    UiUtilsProvider,
    DataInfoProvider
  ]
})
export class AppModule {}
