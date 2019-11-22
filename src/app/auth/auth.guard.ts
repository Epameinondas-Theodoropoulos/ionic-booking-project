import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

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
    
    if(!this.authService.userIsAuthneticated)
    {
      this.router.navigateByUrl('/auth');
    }
    // debugger;
    return this.authService.userIsAuthneticated;
  }

}
