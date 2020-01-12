import { Injectable, OnDestroy } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { BehaviorSubject, from } from "rxjs";
import { User } from "./user.model";
import { map, tap } from "rxjs/operators";
import {Plugins} from '@capacitor/core';
import { parse } from 'querystring';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  localId: string;
  expiresIn: string;
  registered?: boolean;
}

@Injectable({
  providedIn: "root"
})
export class AuthService implements OnDestroy {
  // ta vgazoume giati tha kanoyme diaforetika twra to authentication.
  // ftiaxame to user.model.ts poy den to eixam prin
  // private _userIsAuthneticated: boolean = false ; // kanonika false. to kanoume tru gia na mhn patame synexeia login
  // private _userId: string = null;
  private _user = new BehaviorSubject<User>(null);
  private activeLogoutTimer: any;

  constructor(private http: HttpClient) {}

  autoLogin()
  {
    //to from pairnei ena promise kai thn akouei kai thn metatrepei se ena observable
    return from(Plugins.Storage.get({
      key: 'authData'
    }))
    .pipe(
      //I will need the map operator to convert that data I'm extracting from the storage to something I can use for actually creating a user object
      map(storedData => {
        if(!storedData || !storedData.value)
        {
          return null;
        }
        const parsedData = JSON.parse(storedData.value) as {token: string; tokenExpirationDate: string; userId: string; email: string };
        const expirationTime = new Date(parsedData.tokenExpirationDate);
        if(expirationTime <= new Date()) //einai parelthon
        {
          return null;
        }
        const user = new User(
          parsedData.userId,
          parsedData.email,
          parsedData.token,
          expirationTime
        );
        return user;
      }),
      tap(user => {
        if(user)
        {
          this._user.next(user);
          this.autoLogout(user.tokenDuration);
        }
      }),
      map(user => {
        return !!user;
      })
    );
  }

  private autoLogout(duration: number)
  {
    if(this.activeLogoutTimer)
    {
      clearTimeout(this.activeLogoutTimer);
    }
    this.activeLogoutTimer = setTimeout(() => {
      this.logout();
    }, duration);
  }

  get userIsAuthneticated() {
    console.log("get gia userIsAuthneticated");
    // return this._userIsAuthneticated;
    return this._user.asObservable().pipe(
      map(user => {
        if (user) {
          return !!user.token;
        } else {
          return false;
        }
      }) //gyrnaei ena boolean
    );
  }

  get userId() {
    // return this._userId;
    return this._user.asObservable().pipe(
      map(user => {
        if (user) {
          return user.id;
        } else {
          return null;
        }
      }) //gyrnaei ena string
    );
  }

  get token()
  {
    return this._user.asObservable().pipe(
      map(user => {
        if (user) {
          return user.token;
        } else {
          return null;
        }
      }) 
    );
  }

  login(email: string, password: string) {
    // twra epeidh tha kanoyme kanoniko login tha to valoyme se allo shmeio
    // this._userIsAuthneticated = true;
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
        {
          email: email,
          password: password,
          returnSecureToken: true
        }
      )
      .pipe(
        //to vazoume xwris parenthesi epeidh den theloume na ektelesoume auton ton kwdika otan ginei parsed
        // anti aytou tha perasoume ena reference ayths ths methodou sthn tap methodo wste na ektelestei
        tap(this.setUserData.bind(this))
      );
  }

  logout() {
    // this._userIsAuthneticated = false;
    if(this.activeLogoutTimer)
    {
      clearTimeout(this.activeLogoutTimer);
    }
    this._user.next(null);
    Plugins.Storage.remove({key: 'authData'});
  }

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`,
        {
          email: email,
          password: password,
          returnSecureToken: true
        }
      )
      .pipe(
        //to vazoume xwris parenthesi epeidh den theloume na ektelesoume auton ton kwdika otan ginei parsed
        // anti aytou tha perasoume ena reference ayths ths methodou sthn tap methodo wste na ektelestei
        tap(this.setUserData.bind(this)) //tap into that observable chaing and execute some code
      );
  }

  private setUserData(userData: AuthResponseData) {
    const expirationTime = new Date(
      new Date().getTime() + +userData.expiresIn * 1000
    ); //to metatrepoyme se milliseconds kai pairnoyme thn wra poy exoume twra + 1 vra akomi

    const user = new User(
      userData.localId,
      userData.email,
      userData.idToken,
      expirationTime
    );

    this._user.next(user);
    this.autoLogout(user.tokenDuration);
    this.storeAuthData(userData.localId, userData.idToken, expirationTime.toISOString(), userData.email);
  }

  private storeAuthData(userId: string, token: string, tokenExpirationDate: string, email: string)
  {
    const data = JSON.stringify({
      userId: userId,
      token: token,
      tokenExpirationDate: tokenExpirationDate,
      email: email
    });
    Plugins.Storage.set({key: 'authData', value: data});
  }

  ngOnDestroy()
  {
    if(this.activeLogoutTimer)
    {
      clearTimeout(this.activeLogoutTimer);
    }
  }
}
