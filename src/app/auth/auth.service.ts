import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  _userIsAuthneticated: boolean = false;
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
