import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate, keyframes, group } from '@angular/animations';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  animations: [
    trigger('divState', [
      //theloume na exoume dyo state kai theloume na exoume animation anamesa se auta ta 2 state
      // kai ayto einai simantiko. Metavaineiw apo to ena state sto allo 
      // Sto prwto argument pername to onoma tou state 
      // STo deutero argumnet to style tou state autou
      state('normal', style({
        'background-color': 'red',
        transform: 'translateX(0)' //exei thn default thesi tou kai den metakineitai pouthena apo aristera or dexia 
      })),
      state('highlighted', style({
        'background-color': 'blue',
        transform: 'translateX(100px)' //to pame 100pixel dexia 
      })),
      //mas epitrepei na perigrapsoume pws tha einai to transition apo to ena state sto allo
      // San prwto argument pairnei to arxiko state  me ena velos pou deixnei sto allo state pou paei
      // Sto deutero leme to animation. 
      // Me to poion aplo tropo, vazoume ena noumero kai leme posa millseconds tha parei 
      transition('normal <=> highlighted',animate(300)),
     // transition('highlighted => normal',animate(800))
     // anti na to grpasoume deuterh fora , gia to IDIO timimeng apla bazoume velos kai sta dyo
     // gia na deixnei thn metavash kai sta 2 

    ]),

    //theloume na doume ti tha kanei kata thn diarkeia ths metavaseis.Na valoume ena allo animation
    // se auto to shmeio tou xronou . Opote ftiaxnoume ena kainourgio div kai vazoume to state mas 
    trigger('wildState', [
      state('normal', style({
        'background-color': 'red',
        transform: 'translateX(0) scale(1)', //to scale einai gia na exei to kanoniko megethos 
        borderRadius: 0
      })),
      state('highlighted', style({
        'background-color': 'blue',
        transform: 'translateX(100px) scale(1)',
        borderRadius: 0
      })), 
      state('shrunken', style({
        'background-color': 'green',
        transform: 'translateX(0px) scale(0.5)',
        borderRadius: 0
      })),
      transition('normal => highlighted',animate(300)),
      transition('highlighted => normal',animate(800)),
      // me to asteraki leme oti : Apo kai pros opoiodipote state tha efarmoseis ayto to animation
      // dhladh na ginei to prasino tetragwnaki
      //edw orizoume ena style kata thn diarkeia tou animation
    //  transition('shrunken <=> *',animate(500, style({
    //     borderRadius: '50px'
    //       })
    //     )
    //  ), 
      //des thn diafora apo ayto to sto comment me to auto twra pio katw. Exei sxesh me thn topothetisi tou style
      transition('shrunken <=> *',[
        //vlepoume katheuian allagi na ginetia porotkali
          style({
            'background-color': 'orange'
          }),
          //tha parei ena deuteropleto mexri na ginei kylos gia ta border
          animate(1000,style({
            borderRadius: '50px'
          })),
          //ekteleitai afou exoun allazei ta border. kai apo orange ginetai prasino tetragwnaki 
          //me metavasi misou deuterolpetoy kai phgaine sto state pou patithike na paei
          animate(500)
        ]) 
      ])
  ]
})
export class AuthPage implements OnInit {

  constructor(private authService: AuthService,private router: Router) { }

  ngOnInit() {
  }

  onLogin()
  {
    this.authService.login();
    this.router.navigateByUrl('/places/tabs/discover');
  }





   //terma xehoristo apo to animation. Vazeis oti theleis esy . 
   //Alla tha to xrisimopoiohsoume mesa sto trigger gia tiw diaforetikes times pou mporei na parei
  state = 'normal'; 
  wildState = 'normal';



    onAnimate(){
      this.state == 'normal' ? this.state = 'highlighted' : this.state = 'normal'; 

      this.wildState == 'normal' ? this.wildState = 'highlighted' : this.wildState = 'normal'; 

    }

    onShrink(){
      this.wildState = 'shrunken';
    }

    animationStarted(event)
    {
      console.log("Started");
    }

    animationEnded(event)
    {
      console.log("Ended");
    }

}
