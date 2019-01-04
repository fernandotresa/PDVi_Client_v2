import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController} from 'ionic-angular';
import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import { ShopPage } from '../pages/shop/shop';
import { SettingsPage } from '../pages/settings/settings';
import { ParkingPage } from '../pages/parking/parking';

import { SideMenuSettings } from './../shared/side-menu-content/models/side-menu-settings';
import { SideMenuOption } from './../shared/side-menu-content/models/side-menu-option';
import { SideMenuContentComponent } from './../shared/side-menu-content/side-menu-content.component';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  @ViewChild(SideMenuContentComponent) sideMenu: SideMenuContentComponent;

  public options: Array<SideMenuOption>;

	public sideMenuSettings: SideMenuSettings = {
		accordionMode: true,
		showSelectedOption: true,
		selectedOptionClass: 'active-side-menu-option'		
  };

  //rootPage:any = TabsPage;
  rootPage:any = LoginPage;
  

  constructor(platform: Platform, private menuCtrl: MenuController) {
    platform.ready().then(() => {
      this.initializeOptionsClient()
    });
  }

  public onOptionSelected(option: SideMenuOption): void {
		this.menuCtrl.close().then(() => {

			if (option.custom && option.custom.isLogin) {
				console.log('You\'ve clicked the login option!');


			} else if (option.custom && option.custom.isLogout) {

				console.log('You\'ve clicked the logout option!');
				this.nav.setRoot(LoginPage, { autoLogin: false })

			} else if (option.custom && option.custom.isHome)
				  this.nav.setRoot(TabsPage)
	
			else if (option.custom && option.custom.isExternalLink) {
				let url = option.custom.externalUrl;
				window.open(url, '_blank');

			} else {
				
				const params = option.custom && option.custom.param;
				this.nav.push(option.component, params);
					
			}
		});
	}

	public collapseMenuOptions(): void {
		this.sideMenu.collapseAllOptions();
	}


  private initializeOptionsClient(): void {

    this.options = new Array<SideMenuOption>();
    
		this.options.push({
			iconName: 'map',
			displayText: 'Início',			
			custom: {
				isHome: true
			}			
		});								
		
		this.options.push({
			iconName: 'cart',
			displayText: 'Vendas online',
			component: ShopPage			
		});						

		this.options.push({
			iconName: 'car',
			displayText: 'Estacionamento',
			component: ParkingPage			
    });	

    this.options.push({
			iconName: 'cog',
			displayText: 'Configurações',
			component: SettingsPage			
		});	
		
		this.options.push({
			iconName: 'log-out',
			displayText: 'Sair',
			custom: {
				isLogout: true
			}			
		});
	}	
}
