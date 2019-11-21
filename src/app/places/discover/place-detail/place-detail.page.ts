import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { PlacesService } from '../../places.service';
import { Place } from '../../place.model';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {

  constructor(private router: Router, private navCtrl: NavController, private route: ActivatedRoute, private placesService: PlacesService) { }

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
    //this.router.navigateByUrl('/places/tabs/discover');

    // h diafora me to button pou valame me ta component ths ionic einai oti ekeino xerei na pexei ta swsta animations
    // auto edw den xerei. Opote me to navigateBack xerei ti na paixei san animation
    this.navCtrl.navigateBack('/places/tabs/discover'); //tha xrisimopoihsei to angular router 
    //this.navCtrl.pop() //vgazei thn teleutaia page apo to stack. An kaneis reload omws xekinaei apo mia selida sto stack kai den xerei pou na paei
  }

}
