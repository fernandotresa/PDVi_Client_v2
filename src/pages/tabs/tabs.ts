import { Component } from '@angular/core';
import { HomePage } from '../home/home';
import { SettingsPage } from '../settings/settings';
import { ShopPage } from '../shop/shop';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = ShopPage;
  tab3Root = SettingsPage;

  constructor() {

  }
}
