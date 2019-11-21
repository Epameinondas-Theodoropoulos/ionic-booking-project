import { Component, OnInit } from '@angular/core';
import { PlacesService } from '../places.service';
import { Offer } from './offer.model';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {

  constructor(private placesService: PlacesService) { }

  loadedOffers: Offer[]
  ngOnInit() {
    this.loadedOffers = this.placesService.offers;
  }

}
