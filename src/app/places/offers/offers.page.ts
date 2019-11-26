import { Component, OnInit } from '@angular/core';
import { PlacesService } from '../places.service';
import { Offer } from './offer.model';
import { IonItemSliding } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {

  constructor(private placesService: PlacesService, private router: Router) { }

  loadedOffers: Offer[]
  ngOnInit() {
    this.loadedOffers = this.placesService.offers;
  }

  onEdit(offerId: string, slidingItem: IonItemSliding)
  {
    console.log('Offer Id : ' , offerId);
    slidingItem.close();
    this.router.navigate(['/', 'places', 'tabs', 'offers', 'edit', offerId]);
  }

}
