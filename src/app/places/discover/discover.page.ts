import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlacesService } from '../places.service';
import { Place } from '../place.model';
import { MenuController } from '@ionic/angular';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit,OnDestroy {

  constructor(private placesService: PlacesService, private menuCtrl: MenuController) { }
  loadedPlaces: Place[];
  listedLoadedPlaces: Place[];
  listedPlacesSub: Subscription;
  ngOnInit() {
   // this.loadedPlaces = this.placesService.places;
   this.listedPlacesSub = this.placesService.places.subscribe(
     places => {
       this.loadedPlaces = places;
       this.listedLoadedPlaces = this.loadedPlaces.slice(1);
     }
   )
  }

  onFilterUpdatE(event: CustomEvent<SegmentChangeEventDetail>)
  {
    console.log(event.detail);
  }

  ngOnDestroy()
  {
    if(this.listedPlacesSub){
      this.listedPlacesSub.unsubscribe;
    }
  }

  //Deuteri methodos gia na anoixeis to menu
  // onOpenMenu()
  // {
  //   this.menuCtrl.toggle('m1');
  // }

}
