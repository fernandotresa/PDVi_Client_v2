import { ErrorHandler, Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { HistoryPageModule } from '../pages/history/history.module';
import { ProductsPageModule } from '../pages/products/products.module';
import { ShopPageModule } from '../pages/shop/shop.module';
import { CheckoutPageModule } from '../pages/checkout/checkout.module';
import { SettingsPageModule } from '../pages/settings/settings.module';
import { TicketsPageModule } from '../pages/tickets/tickets.module';
import { ParkingPageModule } from '../pages/parking/parking.module';
import { PaymentPageModule } from '../pages/payment/payment.module';
import { LoginPageModule } from '../pages/login/login.module';
import { CashChangePageModule } from '../pages/cash-change/cash-change.module';
import { CashDrainPageModule } from '../pages/cash-drain/cash-drain.module';
import { CashStatementPageModule } from '../pages/cash-statement/cash-statement.module';
import { SupervisorPageModule } from '../pages/supervisor/supervisor.module';
import { SubproductsPageModule } from '../pages/subproducts/subproducts.module';

import { HttpdProvider } from '../providers/httpd/httpd';
import { HttpClientModule } from '@angular/common/http';
import { UiUtilsProvider } from '../providers/ui-utils/ui-utils';
import { DataInfoProvider } from '../providers/data-info/data-info';

import { SideMenuContentComponent } from '../shared/side-menu-content/side-menu-content.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

  
@NgModule({
  declarations: [
    MyApp,    
    HomePage,        
    SideMenuContentComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    BrowserAnimationsModule    
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,    
    HomePage
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
    SubproductsPageModule,
    LoginPageModule,
    CashChangePageModule,
    CashDrainPageModule,
    CashStatementPageModule,
    SupervisorPageModule
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
