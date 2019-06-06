import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController	} from 'ionic-angular';
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
//import { AdministratorPage } from '../pages/administrator/administrator';
import { SideMenuSettings } from './../shared/side-menu-content/models/side-menu-settings';
import { SideMenuOption } from './../shared/side-menu-content/models/side-menu-option';
import { SideMenuContentComponent } from './../shared/side-menu-content/side-menu-content.component';
import * as firebaseApp from 'firebase/app';

export const firebaseConfig = {
	apiKey: "AIzaSyAzSLbqgDiYqYIkemFmOmnJIb2DBesxL7I",
	authDomain: "pdvi-d9207.firebaseapp.com",
	databaseURL: "https://pdvi-d9207.firebaseio.com",
	projectId: "pdvi-d9207",
	storageBucket: "pdvi-d9207.appspot.com",
	messagingSenderId: "940789269313",
	appId: "1:940789269313:web:a16fae4bdd9f4a9e"
  };

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
	
	//rootPage:any = AdministratorPage;

	rootPage:any = LoginPage;	  

  constructor(platform: Platform, private menuCtrl: MenuController) {
    platform.ready().then(() => {
			this.initializeOptionsClient()
			//this.menuCtrl.enable(false)

			if(firebaseApp){
				if(!firebaseApp.apps.length)      
				firebaseApp.initializeApp(firebaseConfig)  
			
			  }    
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
				  this.nav.setRoot(HomePage)
	
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
			iconName: 'ios-print',
			displayText: 'PDVi',
			component: HomePage			
		});

		this.options.push({
			iconName: 'pricetag',
			displayText: 'Totem de acesso',
			custom: {
				isExternalLink: true,
				externalUrl: "http://localhost/totem_acesso/	"
			}			
		});	

		this.options.push({
			iconName: 'hand',
			displayText: 'Receptor',
			component: "ReceptorPage"			
		});						
		
		this.options.push({
			iconName: 'cart',
			displayText: 'Vendas online',
			component: "ShopPage"			
		});						

		this.options.push({
			iconName: 'car',
			displayText: 'Estacionamento',
			component: "ParkingPage"			
		});	
		
		this.options.push({
			iconName: 'people',
			displayText: 'Supervisão',
			component: "SupervisorPage"			
		});

    this.options.push({
			iconName: 'cog',
			displayText: 'Configurações',
			component: "SettingsPage"			
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

