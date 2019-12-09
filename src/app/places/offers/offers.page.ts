import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlacesService } from '../places.service';
import { Offer } from './offer.model';
import { IonItemSliding } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {

  constructor(private placesService: PlacesService, private router: Router) { }

  loadedOffers: Offer[];
  private offersSub: Subscription;
  isLoading = false;

  ngOnInit() {
    // this.loadedOffers = this.placesService.offers;
    this.offersSub = this.placesService.offers.subscribe(
      offers => {
        this.loadedOffers = offers;
      }
    );
  }

  ionViewWillEnter()
  {
    this.isLoading = true;
    this.placesService.fetchOffers().subscribe(() => {
      this.isLoading = false;
    });
  }

  onEdit(offerId: string, slidingItem: IonItemSliding)
  {
    console.log('Offer Id : ' , offerId);
    slidingItem.close();
    this.router.navigate(['/', 'places', 'tabs', 'offers', 'edit', offerId]);
  }

  ngOnDestroy()
  {
    if(this.offersSub)
    {
      this.offersSub.unsubscribe();
    }
    
  }

}
