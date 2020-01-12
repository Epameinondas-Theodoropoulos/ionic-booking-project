import { Component, OnInit, OnDestroy } from "@angular/core";
import { PlacesService } from "../places.service";
import { Place } from "../place.model";
import { MenuController } from "@ionic/angular";
import { SegmentChangeEventDetail } from "@ionic/core";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { take } from 'rxjs/operators';

@Component({
  selector: "app-discover",
  templateUrl: "./discover.page.html",
  styleUrls: ["./discover.page.scss"]
})
export class DiscoverPage implements OnInit, OnDestroy {
  constructor(
    private placesService: PlacesService,
    private menuCtrl: MenuController,
    private authService: AuthService
  ) {}
  loadedPlaces: Place[];
//  listedLoadedPlaces: Place[];
private filter = 'all';
  listedPlacesSub: Subscription;
  relevantPlaces: Place[];
  isLoading = false;

  ngOnInit() {
    // this.loadedPlaces = this.placesService.places;
    this.listedPlacesSub = this.placesService.places.subscribe(places => {
      this.loadedPlaces = places;
      this.onFilterUpdate(this.filter);
    //  this.relevantPlaces = places;
    //  this.listedLoadedPlaces = this.relevantPlaces.slice(1);
    });
  }

  ionViewWillEnter()
  {
    this.isLoading = true;
    this.placesService.fetchPlaces().subscribe(() => {
      this.isLoading = false;
    });
  }

  // onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) 
  // {
    // console.log(event.detail);
    // if (event.detail.value === "all") {
    //   this.relevantPlaces = this.loadedPlaces;
    //   this.listedLoadedPlaces = this.relevantPlaces.slice(1);
    // } else {
    //   //ayto to meros den dhmiourgithike apo emena opote einai bookable.
    //   this.relevantPlaces = this.loadedPlaces.filter(
    //     place => place.userId !== this.authService.userId
    //   );
    //   this.listedLoadedPlaces = this.relevantPlaces.slice(1);
    // }

  // }

  onFilterUpdate(filter: string) 
  {
    this.authService.userId
    .pipe(
      take(1)
    )
    .subscribe(
      userId => {
        /// to eixame apo exw alla epeidh allaxame to pvw kaloume to userId kai to kaname subsject to metaferame edw
        console.log(filter);
        if(filter === 'all')
        {
          this.relevantPlaces = this.loadedPlaces;
          console.log("relevantPlaces: ", this.relevantPlaces);
        }
        else{
          this.relevantPlaces = this.loadedPlaces.filter(place => 
            place.userId !== userId
          );
        }
        ////
    
      }
    );

    this.filter = filter;
  }

  ngOnDestroy() {
    if (this.listedPlacesSub) {
      this.listedPlacesSub.unsubscribe;
    }
  }

  //Deuteri methodos gia na anoixeis to menu
  // onOpenMenu()
  // {
  //   this.menuCtrl.toggle('m1');
  // }
}

/*

The code above refers to sections 11 - 14. At the end of section 15, 
with authentication implemented, the filter method should then look like this:

onFilterUpdate(filter: string) {
  this.authService.userId.pipe(take(1)).subscribe(userId => {
    const isShown = place => filter === 'all' || place.userId !== userId;
    this.relevantPlaces = this.loadedPlaces.filter(isShown);
    this.filter = filter;
  });
}

*/
