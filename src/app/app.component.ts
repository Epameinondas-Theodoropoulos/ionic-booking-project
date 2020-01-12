import { Component, OnInit, OnDestroy } from '@angular/core';

import { Platform } from '@ionic/angular';
// import { SplashScreen } from '@ionic-native/splash-screen/ngx';
// import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Plugins, Capacitor } from '@capacitor/core';

import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {

  private authSub: Subscription;
  private previousAuthState = false;

  constructor(
    // sou epitrepei na katalaveis sto platform pou trexei to app sou ,an einai etoimo
    private platform: Platform,
  //  private splashScreen: SplashScreen, // einai apo cordova opote den ta xrisimopoioume edw
  //  private statusBar: StatusBar, // einai apo cordova opote den ta xrisimopoioume edw 
    private authService: AuthService,
    private router: Router
  ) {
    this.initializeApp();
  }

  //einai pio grhgoro apo to auth guard mas
  // opote otan kanei reload den paei sto autologin. 
  // gia ayto bazoume to property previousAuthState
  ngOnInit()
  {
    this.authSub = this.authService.userIsAuthneticated.subscribe(isAuth => {
      if(!isAuth && this.previousAuthState !== isAuth)
      {
        this.router.navigateByUrl('/auth'); //opote einai false dhladh dne yparxei user tha kanei navigate

      }
      this.previousAuthState = isAuth;
    });
  }

  ngOnDestroy()
  {
    if(this.authSub)
    {
      this.authSub.unsubscribe();
    }
  }

  initializeApp() {
 //   this.platform // me tis epiloges pou exei mporeis na deis to dimension
  //  this. platform.is('Android') // mporei na deis se ti platforma trexei to app sou
    this.platform.ready().then(() => {

      if(Capacitor.isPluginAvailable('SplashScreen'))
      {
        Plugins.SplashScreen.hide();// automatically shows when the application boots
      }

      // this.statusBar.styleDefault();
      // this.splashScreen.hide();
    });
  }

  onLogout() 
  {
   this.authService.logout();
  //  this.router.navigateByUrl('/auth');
  }
}
