import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _userIsAuthneticated: boolean = true ; // kanonika false. to kanoume tru gia na mhn patame synexeia login
  private _userId = 'abc';
  constructor() { }

  get userIsAuthneticated()
  {
    console.log('get gia userIsAuthneticated');
    return this._userIsAuthneticated;
  }

  get userId ()
  {
    return this.userId;
  }

  login()
  {
    this._userIsAuthneticated = true;
  }

  logout()
  {
    // debugger;
    this._userIsAuthneticated = false;
  }
}
