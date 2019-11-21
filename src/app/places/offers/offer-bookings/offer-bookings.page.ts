import { Component, OnInit } from '@angular/core';
import { Offer } from '../offer.model';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-offer-bookings',
  templateUrl: './offer-bookings.page.html',
  styleUrls: ['./offer-bookings.page.scss'],
})
export class OfferBookingsPage implements OnInit {

  offer: Offer;
  constructor(private route: ActivatedRoute, private navCtrl: NavController, private placesService: PlacesService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(
      (paramMap) => {
        if(!paramMap.has('placeId')){
          this.navCtrl.navigateBack('/places/tabs/offers');
          return;
        }
        this.offer = this.placesService.getOffer(paramMap.get('placeId'));
      }
    );
  }

}
