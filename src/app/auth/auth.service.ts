import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  _userIsAuthneticated: boolean = true ; // kanonika false. to kanoume tru gia na mhn patame synexeia login
  constructor() { }

  get userIsAuthneticated()
  {
    console.log('get gia userIsAuthneticated');
    return this._userIsAuthneticated;
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
