import { Component, OnInit } from '@angular/core';
import { PlacesService } from '../places.service';
import { Place } from '../place.model';
import { MenuController } from '@ionic/angular';
import { SegmentChangeEventDetail } from '@ionic/core';


@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {

  constructor(private placesService: PlacesService, private menuCtrl: MenuController) { }
  loadedPlaces: Place[];
  listedLoadedPlaces: Place[];
  ngOnInit() {
    this.loadedPlaces = this.placesService.places;
    this.listedLoadedPlaces = this.loadedPlaces.slice(1);
  }

  onFilterUpdatE(event: CustomEvent<SegmentChangeEventDetail>)
  {
    console.log(event.detail);
  }

  //Deuteri methodos gia na anoixeis to menu
  // onOpenMenu()
  // {
  //   this.menuCtrl.toggle('m1');
  // }

}
