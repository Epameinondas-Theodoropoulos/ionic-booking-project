import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Offer } from '../offer.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit {

  constructor(private route: ActivatedRoute, private navCtrl: NavController, private placesService: PlacesService) { }

  offer: Offer;
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
