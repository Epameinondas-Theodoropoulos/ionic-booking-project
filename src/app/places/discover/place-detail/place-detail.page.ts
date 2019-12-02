import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController, ModalController, ActionSheetController } from '@ionic/angular';
import { PlacesService } from '../../places.service';
import { Place } from '../../place.model';
import { CreateBookingComponent } from 'src/app/bookings/create-booking/create-booking.component';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {

  constructor(
    private router: Router, 
    private navCtrl: NavController, 
    private route: ActivatedRoute, 
    private placesService: PlacesService,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController // A set of options that slides up from the bottom of the page
    ) { }

  place: Place;
  ngOnInit() {
    this.route.paramMap.subscribe(
      (paramMap) => {
        if(!paramMap.has('placeId')){
          this.navCtrl.navigateBack('/places/tabs/discover');
          return;
        }
        this.place = this.placesService.getPlace(paramMap.get('placeId'))
      }
    );
  }

  onBookPlace()
  {
    /*
    //this.router.navigateByUrl('/places/tabs/discover');

    // h diafora me to button pou valame me ta component ths ionic einai oti ekeino xerei na pexei ta swsta animations
    // auto edw den xerei. Opote me to navigateBack xerei ti na paixei san animation
    this.navCtrl.navigateBack('/places/tabs/discover'); //tha xrisimopoihsei to angular router 
    //this.navCtrl.pop() //vgazei thn teleutaia page apo to stack. An kaneis reload omws xekinaei apo mia selida sto stack kai den xerei pou na paei

    */

    // Pio prin mexri na ftasoume na ftiaxoume to modal eixame to apo panw poy den ekane tipota. Ftasame sth enotita tou modal twra

    this.actionSheetCtrl.create({
      header: 'Choose an Action',
      buttons:[
        {
          text: 'Select Date',
          handler: () => {this.openBookingModal('select')}
        },
        {
          text: 'Random Date',
          handler: () => {this.openBookingModal('random')}
        },
        {
          text: 'Cancel',
          role: 'destructive'
        }
      ]
    })
    .then(actionSheetEl => {
      actionSheetEl.present();
    })

    
  }

  //dexetai mono autes tis 2 times
  openBookingModal(mode: 'select' | 'random')
  {
    console.log(mode);
    this.modalCtrl
    .create({
      component: CreateBookingComponent, // to vazoume kai sto declerations kai sto entryComponents gia na xrisimopoihtei edw. Des to module tou
      componentProps: {selectedPlace: this.place, selectedMode: mode}
    })
    .then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss(); //gyrnaei ena allo promise opote mporoume na kanoume chain ta then
    })
    .then(resultData => {
      console.log(resultData.data, resultData.role);
      if(resultData.role === 'confirm')
      {
        console.log("BOOKED!!");
      }
    });
  }

}
