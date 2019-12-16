import { ErrorHandler, Injector, NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Camera } from '@ionic-native/camera';

import { HomePage } from '../pages/home/home';
import { AttachmentsPageModule } from '../pages/attachments/attachments.module';
import { HistoryPageModule } from '../pages/history/history.module';
import { AdministratorPageModule } from '../pages/administrator/administrator.module';
import { ProductsPageModule } from '../pages/products/products.module';
import { ShopPageModule } from '../pages/shop/shop.module';
import { AttachmentsListPageModule } from '../pages/attachments-list/attachments-list.module';
import { CheckoutPageModule } from '../pages/checkout/checkout.module';
import { SettingsPageModule } from '../pages/settings/settings.module';
import { TicketsPageModule } from '../pages/tickets/tickets.module';
import { ParkingPageModule } from '../pages/parking/parking.module';
import { PaymentPageModule } from '../pages/payment/payment.module';
import { LoginPageModule } from '../pages/login/login.module';
import { UsersPageModule } from '../pages/users/users.module';
import { UsersAddPageModule } from '../pages/users-add/users-add.module';
import { PreprintedPageModule } from '../pages/preprinted/preprinted.module';

import { CashChangePageModule } from '../pages/cash-change/cash-change.module';
import { CashDrainPageModule } from '../pages/cash-drain/cash-drain.module';
import { CashStatementPageModule } from '../pages/cash-statement/cash-statement.module';
import { SupervisorPageModule } from '../pages/supervisor/supervisor.module';
import { SubproductsPageModule } from '../pages/subproducts/subproducts.module';
import { ReceptorPageModule } from '../pages/receptor/receptor.module';

import { HttpdProvider } from '../providers/httpd/httpd';
import { HttpClientModule } from '@angular/common/http';
import { UiUtilsProvider } from '../providers/ui-utils/ui-utils';
import { DataInfoProvider } from '../providers/data-info/data-info';

import { SideMenuContentComponent } from '../shared/side-menu-content/side-menu-content.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CameraProvider } from '../providers/camera/camera';
import { StorageProvider } from '../providers/storage/storage';

import { Firebase } from '@ionic-native/firebase/ngx';
import { AngularFireModule } from 'angularfire2';

import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireStorageModule } from 'angularfire2/storage';

import { ConfigurationService } from "ionic-configuration-service";
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { CurrencyPipe } from '@angular/common';

export function loadConfiguration(configurationService: ConfigurationService): () => Promise<void> {
  return () => configurationService.load("assets/configs/document.json");
}

export const firebaseConfig = {
  apiKey: "AIzaSyAzSLbqgDiYqYIkemFmOmnJIb2DBesxL7I",
  authDomain: "pdvi-d9207.firebaseapp.com",
  databaseURL: "https://pdvi-d9207.firebaseio.com",
  projectId: "pdvi-d9207",
  storageBucket: "pdvi-d9207.appspot.com",
  messagingSenderId: "940789269313",
  appId: "1:940789269313:web:a16fae4bdd9f4a9e"
};


  
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
    BrowserAnimationsModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,    
    AngularFireModule.initializeApp(firebaseConfig),    
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,    
    HomePage
  ],
  
  exports: [    
    AdministratorPageModule,
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
    SupervisorPageModule,
    UsersPageModule,
    ReceptorPageModule,
    AttachmentsPageModule,
    AttachmentsListPageModule,
    UsersAddPageModule,
    PreprintedPageModule
    ],
  providers: [    
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    HttpdProvider,
    UiUtilsProvider,
    DataInfoProvider,
    Firebase,
    Camera,
    CameraProvider,
    StorageProvider,
    InAppBrowser,
    CurrencyPipe,
    ConfigurationService,
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfiguration,
      deps: [ConfigurationService],
      multi: true
    },
    ]
})

export class AppModule {
  static injector: Injector;

  constructor(injector: Injector) {
    AppModule.injector = injector;
  }
}

