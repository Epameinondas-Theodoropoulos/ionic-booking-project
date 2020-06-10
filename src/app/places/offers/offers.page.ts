import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlacesService } from '../places.service';
import { IonItemSliding } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription, from } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { take, concatMap, switchMap, map, mergeMap } from 'rxjs/operators';
import { Place } from '../place.model';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {

  constructor(private placesService: PlacesService, private router: Router, private authService: AuthService) { }

  loadedOffers: Place[];
  private offersSub: Subscription;
  isLoading = false;
  fetchedUserId: string;

  ngOnInit() {
    // this.loadedOffers = this.placesService.offers;

    // this.offersSub = this.placesService.places.subscribe(
    //   offers => {
    //     debugger;
    //     this.loadedOffers = offers
    //   }
    // );

    this.offersSub = this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        if (!userId) {
          throw new Error("No user id found!");
        }
        this.fetchedUserId = userId;
        return userId;
      }),
      take(1),
      switchMap( userId => {
       // debugger;
        return  this.placesService.places;
      })
    ).subscribe(offers => {
     // debugger;
      this.loadedOffers = offers.filter(offer => offer.userId === this.fetchedUserId)
    })



  }

  ionViewWillEnter()
  {
    this.isLoading = true;
    this.placesService.fetchPlaces().subscribe(() => {
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
