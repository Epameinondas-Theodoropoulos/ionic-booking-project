import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { take, tap, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
// to CanLoad trexei prin o kwdikas tou lazi load ginei fetch. To theloume epeidh exoume lazy load 
/// dioti me to CanActivate tha itan lathos. Kai ayto giati me to lazy load tha katevaine o kwdikas
// prin ektelestei to Guard
export class AuthGuard implements CanLoad {
  constructor(private authService: AuthService, private router: Router){}
  canLoad(
    route: Route, 
    segments: UrlSegment[],
    ): Observable<boolean> | Promise<boolean> | boolean
  {
    
    // if(!this.authService.userIsAuthneticated)
    // {
    //   this.router.navigateByUrl('/auth');
    // }
    // return this.authService.userIsAuthneticated;
    return this.authService.userIsAuthneticated
    .pipe(
      take(1),
      //ftiaxame to autologin , opote prosthetoume thn swtichMap kai kanoume ton elegxo na doume an mporei na kanei autologin
      switchMap(isAuthneticated => {
        if(!isAuthneticated)
        {
          return this.authService.autoLogin();
        }
        else {
          return of(isAuthneticated);
        }
        
      }),
      tap(isAuthneticated => {
        if(!isAuthneticated)
        {
          this.router.navigateByUrl('/auth');
        }
      })
    );
  }

}
