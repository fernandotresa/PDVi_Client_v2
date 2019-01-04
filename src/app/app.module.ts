import { ErrorHandler, Injectable, Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { HistoryPageModule } from '../pages/history/history.module';
import { ProductsPageModule } from '../pages/products/products.module';
import { ShopPageModule } from '../pages/shop/shop.module';
import { CheckoutPageModule } from '../pages/checkout/checkout.module';
import { SettingsPageModule } from '../pages/settings/settings.module';
import { TicketsPageModule } from '../pages/tickets/tickets.module';
import { ParkingPageModule } from '../pages/parking/parking.module';
import { PaymentPageModule } from '../pages/payment/payment.module';
import { SubproductsPageModule } from '../pages/subproducts/subproducts.module';

import { HttpdProvider } from '../providers/httpd/httpd';
import { HttpClientModule } from '@angular/common/http';
import { UiUtilsProvider } from '../providers/ui-utils/ui-utils';
import { DataInfoProvider } from '../providers/data-info/data-info';

import { SideMenuContentComponent } from '../shared/side-menu-content/side-menu-content.component';

@NgModule({
  declarations: [
    MyApp,    
    HomePage,
    TabsPage,
    SideMenuContentComponent
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
    HistoryPageModule,
    SettingsPageModule,
    TicketsPageModule,
    ShopPageModule,
    ProductsPageModule,
    CheckoutPageModule,
    PaymentPageModule,
    ParkingPageModule,
    SubproductsPageModule
  ],
  providers: [    
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    HttpdProvider,
    UiUtilsProvider,
    DataInfoProvider
  ]
})
export class AppModule {
  static injector: Injector;

  constructor(injector: Injector) {
    AppModule.injector = injector;
  }
}
