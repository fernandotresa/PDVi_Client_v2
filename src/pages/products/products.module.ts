import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductsPage } from './products';
import { TooltipsModule } from 'ionic-tooltips';

@NgModule({
  declarations: [
    ProductsPage,
  ],
  imports: [    
    IonicPageModule.forChild(ProductsPage),
    TooltipsModule.forRoot()        
  ],
})
export class ProductsPageModule {}
