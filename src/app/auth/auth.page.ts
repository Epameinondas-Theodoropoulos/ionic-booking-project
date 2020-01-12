import { Component, OnInit, ViewChild } from "@angular/core";
import { AuthService, AuthResponseData } from "./auth.service";
import { Router } from "@angular/router";
import {
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes,
  group
} from "@angular/animations";
import { LoadingController, AlertController } from "@ionic/angular";
import { NgForm } from "@angular/forms";
import { Observable } from 'rxjs';

@Component({
  selector: "app-auth",
  templateUrl: "./auth.page.html",
  styleUrls: ["./auth.page.scss"],
  animations: [
    trigger("divState", [
      //theloume na exoume dyo state kai theloume na exoume animation anamesa se auta ta 2 state
      // kai ayto einai simantiko. Metavaineiw apo to ena state sto allo
      // Sto prwto argument pername to onoma tou state
      // STo deutero argumnet to style tou state autou
      state(
        "normal",
        style({
          "background-color": "red",
          transform: "translateX(0)" //exei thn default thesi tou kai den metakineitai pouthena apo aristera or dexia
        })
      ),
      state(
        "highlighted",
        style({
          "background-color": "blue",
          transform: "translateX(100px)" //to pame 100pixel dexia
        })
      ),
      //mas epitrepei na perigrapsoume pws tha einai to transition apo to ena state sto allo
      // San prwto argument pairnei to arxiko state  me ena velos pou deixnei sto allo state pou paei
      // Sto deutero leme to animation.
      // Me to poion aplo tropo, vazoume ena noumero kai leme posa millseconds tha parei
      transition("normal <=> highlighted", animate(300))
      // transition('highlighted => normal',animate(800))
      // anti na to grpasoume deuterh fora , gia to IDIO timimeng apla bazoume velos kai sta dyo
      // gia na deixnei thn metavash kai sta 2
    ]),

    //theloume na doume ti tha kanei kata thn diarkeia ths metavaseis.Na valoume ena allo animation
    // se auto to shmeio tou xronou . Opote ftiaxnoume ena kainourgio div kai vazoume to state mas
    trigger("wildState", [
      state(
        "normal",
        style({
          "background-color": "red",
          transform: "translateX(0) scale(1)", //to scale einai gia na exei to kanoniko megethos
          borderRadius: 0
        })
      ),
      state(
        "highlighted",
        style({
          "background-color": "blue",
          transform: "translateX(100px) scale(1)",
          borderRadius: 0
        })
      ),
      state(
        "shrunken",
        style({
          "background-color": "green",
          transform: "translateX(0px) scale(0.5)",
          borderRadius: 0
        })
      ),
      transition("normal => highlighted", animate(300)),
      transition("highlighted => normal", animate(800)),
      // me to asteraki leme oti : Apo kai pros opoiodipote state tha efarmoseis ayto to animation
      // dhladh na ginei to prasino tetragwnaki
      //edw orizoume ena style kata thn diarkeia tou animation
      //  transition('shrunken <=> *',animate(500, style({
      //     borderRadius: '50px'
      //       })
      //     )
      //  ),
      //des thn diafora apo ayto to sto comment me to auto twra pio katw. Exei sxesh me thn topothetisi tou style
      transition("shrunken <=> *", [
        //vlepoume katheuian allagi na ginetia porotkali
        style({
          "background-color": "orange"
        }),
        //tha parei ena deuteropleto mexri na ginei kylos gia ta border
        animate(
          1000,
          style({
            borderRadius: "50px"
          })
        ),
        //ekteleitai afou exoun allazei ta border. kai apo orange ginetai prasino tetragwnaki
        //me metavasi misou deuterolpetoy kai phgaine sto state pou patithike na paei
        animate(500)
      ])
    ])
  ]
})
export class AuthPage implements OnInit {
  isLoading = false;
  isLogin = true;
  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {}

  onSubmit(form: NgForm) {
    // debugger;
    console.log(form);
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    console.log(email, password);

    // if( this.isLogin)
    // {
    //   //send a request a login servers
    // }
    // else
    // {
    //   //send a request to signup servers
    //   this.authService.signup(email, password)
    //   .subscribe(resData => {
    //     console.log(resData);
    //   });
    // }

    this.authenticate(email, password);
    // form.reset();
  }

  private showAlert(message: string)
  {
    this.alertCtrl.create({
      header: 'Authentication failed', 
      message: message,
      buttons: ['Okay']
    }).then(alertel => {
      alertel.present();
    })
  }

  // prin legotan onLogin() kai thn xrisimopoiousame sto deutero button ( ayot pou den exei to 'Switch to' mprosta)
  authenticate(email: string, password: string) {
    // debugger;
    this.isLoading = true;
    
    // this.authService.login(); to metaferoume katw twra mias kai valame authentication

    //diourgei Ena controller programmatistika
    //H diafora einai oti dhiourgei ena overlay pou mas empodizei na exoume opoiadhpote diadrash me thn selida .
    // to theloume se selides typoy login poy o xrhsths PREPEI na perimenei kai den mporei na kanei kati allo
    this.loadingCtrl
      .create({ keyboardClose: true, message: "Logging in..." })
      .then(loadingel => {
        loadingel.present();

        let authObs: Observable<AuthResponseData>;
        //epeidh xrismopoioun thn idia diadikasia epilegoume edw pera to observable
        if(this.isLogin)
        {
          authObs = this.authService.login(email,password);
        }
        else{
          authObs = this.authService.signup(email, password);
        }

        authObs.subscribe(resData => {
          console.log(resData);
          this.isLoading = false;
          loadingel.dismiss();
          this.router.navigateByUrl("/places/tabs/discover");
        }, errRes => {
          loadingel.dismiss();
          const code = errRes.error.error.message;
          let message = 'Could not sign you up, please try again.';
          if( code === 'EMAIL_EXISTS')
          {
            message = 'This email address already exists!';
          }
          else if ( code === 'EMAIL_NOT_FOUND')
          {
            message = 'E-mail address could not be found.'
          }
          else if ( code === 'INVALID_PASSWORD')
          {
            message = 'This password is not correct';
          }
          this.showAlert(message);
        });

        // to eixame me to setTimeout otan kaname fake ena login
        //  setTimeout(() => {
        // this.isLoading = false;
        // loadingel.dismiss();
        // this.router.navigateByUrl('/places/tabs/discover');
        //    }, 2000);
      });
  }

  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }

  //terma xehoristo apo to animation. Vazeis oti theleis esy .
  //Alla tha to xrisimopoiohsoume mesa sto trigger gia tiw diaforetikes times pou mporei na parei
  state = "normal";
  wildState = "normal";

  onAnimate() {
    this.state == "normal"
      ? (this.state = "highlighted")
      : (this.state = "normal");

    this.wildState == "normal"
      ? (this.wildState = "highlighted")
      : (this.wildState = "normal");
  }

  onShrink() {
    this.wildState = "shrunken";
  }

  animationStarted(event) {
    console.log("Started");
  }

  animationEnded(event) {
    console.log("Ended");
  }
}
