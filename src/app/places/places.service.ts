import { Injectable } from "@angular/core";
import { Place } from "./place.model";
import { Offer } from "./offers/offer.model";
import { AuthService } from "../auth/auth.service";
import { BehaviorSubject, of } from "rxjs";
import { take, map, tap, delay, switchMap } from "rxjs/operators";
import { HttpClient } from '@angular/common/http';
import { OfferLocation, PlaceLocation } from './location.model';


interface OfferData {
  availiableFrom: string;
  availiableTo: string;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userId: string;
  location: OfferLocation;
}

interface PlaceData {
  availiableFrom: string;
  availiableTo: string;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userId: string;
  location: PlaceLocation;
}
@Injectable({
  providedIn: "root"
})
export class PlacesService {
  // private _places = new BehaviorSubject<Place[]>([
  //   new Place(
  //     "p1",
  //     "Ilion",
  //     "Dytika proasteia",
  //     "https://www.gtp.gr/showphoto.asp?FN=/MGfiles/location/image13398[1770].jpg&w=650&H=370",
  //     1000,
  //     new Date("2019-01-01"),
  //     new Date("2019-12-31"),
  //     "abc"
  //   ),
  //   new Place(
  //     "p2",
  //     "Petroupoli",
  //     "Dytika kai ayta",
  //     "https://i.ytimg.com/vi/VSlw_tGF1GE/maxresdefault.jpg",
  //     2000,
  //     new Date("2019-01-01"),
  //     new Date("2019-12-31"),
  //     "abc"
  //   ),
  //   new Place(
  //     "p3",
  //     "Aigalew",
  //     "Rakomeladika",
  //     "http://www.athens-car-rental.com/wp-content/uploads/2016/09/EGALEO-CAR-RENTAL.png",
  //     3000,
  //     new Date("2019-01-01"),
  //     new Date("2019-12-31"),
  //     "abc"
  //   ),
  //   new Place(
  //     "p4",
  //     "Xaidari",
  //     "Dytika kai ayta",
  //     "https://i.ytimg.com/vi/VSlw_tGF1GE/maxresdefault.jpg",
  //     2000,
  //     new Date("2019-01-01"),
  //     new Date("2019-12-31"),
  //     "xyz"
  //   ),
  //   new Place(
  //     "p5",
  //     "Agioi Anaruroi",
  //     "Dytika kai ayta",
  //     "https://i.ytimg.com/vi/VSlw_tGF1GE/maxresdefault.jpg",
  //     2000,
  //     new Date("2019-01-01"),
  //     new Date("2019-12-31"),
  //     "abc"
  //   ),
  //   new Place(
  //     "p6",
  //     "Kamatero",
  //     "Dytika kai ayta",
  //     "https://i.ytimg.com/vi/VSlw_tGF1GE/maxresdefault.jpg",
  //     2000,
  //     new Date("2019-01-01"),
  //     new Date("2019-12-31"),
  //     "abc"
  //   )
  // ]);

  private _places = new BehaviorSubject<Place[]>([]);
  private _offers = new BehaviorSubject<Offer[]>([]);

  constructor(private authService: AuthService, private http: HttpClient) {}

  fetchOffers()
  {
    return this.http.get<{[key: string]: OfferData }>('https://ionic-angular-booking-ce888.firebaseio.com/offers.json')
    .pipe(
      map(resData => {
        const offers = [];
        for(const key in resData)
        {
          if(resData.hasOwnProperty(key))
          {
            offers.push(
              new Offer(
                key, 
                resData[key].title, 
                resData[key].description, 
                resData[key].price, 
                resData[key].imageUrl, 
                new Date(resData[key].availiableFrom), 
                new Date(resData[key].availiableTo), 
                resData[key].userId,
                resData[key].location
              )
            );
          }
        }
        return offers;
        //return [];
      }),
      tap(
        //tha kanoume update thn existing list me offers pou exoume idi mesa sto tap
        offers => {
          console.log("FetchDatA-offers: ",offers);
          this._offers.next(offers);
        }
      )
    );
  }

  fetchPlaces()
  {
    return this.http.get<{[key: string]: PlaceData }>('https://ionic-angular-booking-ce888.firebaseio.com/places.json')
    .pipe(
      map(resData => {
        const places = [];
        for(const key in resData)
        {
          if(resData.hasOwnProperty(key))
          {
            places.push(
              new Place(
                key, 
                resData[key].title, 
                resData[key].description, 
                resData[key].imageUrl, 
                resData[key].price, 
                new Date(resData[key].availiableFrom), 
                new Date(resData[key].availiableTo), 
                resData[key].userId,
                resData[key].location
              )
            );
          }
        }
        return places;
      }),
      tap(
        places => {
          console.log("FetchDatA-places: ",places);
          this._places.next(places);
        }
      )
    );
  }

  get places() {
    //  return [...this._places];
    return this._places.asObservable();
  }

  get offers() {
    return this._offers.asObservable();
  }

  getPlace(id: string) {
    return this.http.get<PlaceData>(`https://ionic-angular-booking-ce888.firebaseio.com/places/${id}.json`)
    .pipe(
      map(placeData => {
        return new Place(
          id, 
          placeData.title, 
          placeData.description, 
          placeData.imageUrl,  
          placeData.price,
          new Date(placeData.availiableFrom), 
          new Date(placeData.availiableTo), 
          placeData.userId,
          placeData.location
          )
      }),
      tap(place => {
        console.log(place);
      })
    );
  }

  getOffer(id: string) {
    //  return {...this._offers.find( offer => offer.id === id)}

    // valame firebase opote den to kanoume ayto pleon
    // return this.offers.pipe(
    //   take(1),
    //   map(offers => {
    //     return { ...offers.find(place => place.id === id) };
    //   })
    // );

    return this.http.get<OfferData>(`https://ionic-angular-booking-ce888.firebaseio.com/offers/${id}.json`)
    .pipe(
      map(offerData => {
        return new Offer(
          id, 
          offerData.title, 
          offerData.description, 
          offerData.price,
          offerData.imageUrl,  
          new Date(offerData.availiableFrom), 
          new Date(offerData.availiableTo), 
          offerData.userId,
          offerData.location
          )
      }),
      tap(offer => {
        console.log(offer);
      })
    );
  }

  addOffer(
    title: string,
    descpritpion: string,
    price: number,
    dateFrom: Date,
    dateTo: Date,
    location: OfferLocation
  ) {
    let generateId: string;
    const newOffer = new Offer(
      Math.random().toString(),
      title,
      descpritpion,
      price,
      "https://news.gtp.gr/wp-content/uploads/2019/01/Tritsis-Park.jpg",
      dateFrom,
      dateTo,
      this.authService.userId,
      location
    );

    return this.http.post<{name: string}>('https://ionic-angular-booking-ce888.firebaseio.com/offers.json', {
      ...newOffer, id: null
    })
    .pipe(
      /**
       * to switchMap pairnei ena existing observable chain, kai soy gyrnaei ena neo observable pou meta
       * tha kanei replace to palio observable sta epomena vimata ayths ths alysidas
       */
      switchMap(resData => {
        generateId = resData.name;
        return this.offers;
      }),
      take(1),
      /**
       * logo tou tap den asxoloumaste me to response to http twra alla me to this.places
       */
      tap(offers => {
        newOffer.id = generateId;
        this._offers.next(offers.concat(newOffer));
      })
    );

    /**
     * Tou leei na koitaxei sto offer subject poy exoume apo panw kai se parakalw kane subscribe se ayto
     * alla pare ena object kai meta automata kane cancel to subscription
     * me to 'take' pairnei thn teleutaia lista me ta offers kai den akouei se melontika offers.
     */
    /**
     * Me ton tap operator mas epitrepei na kanoyme kapoia actions se ayto to chain twn operator ,
     * poy den tha allaxei ta data poy pairname mesa sto chain alla den tha oloklirwsei kai to observable.
     *
     * To subscribe apo thn allh tha to oloklirwsei, opote an thelw na kanw tap sto observable apo ena allo meros
     * den tha einai dynaton meta to subscribe. Kai efoson thelw na kanw tap mesa apo thn new-offer page , thelw na gyrisw ena
     * observable edw.
     * Opote tha gyrisei ena full observable twra , opote sthn new-offer page mas dine ena observable gia na kanoyme subscribe
     */
    // this.offers.pipe(take(1)).subscribe(offers => {
    //   setTimeout(() => {
    //     this._offers.next(offers.concat(newOffer));
    //   }, 1000);
    // });

    /**
     * To timeout etsi opws einai twra den tha kanei block oute delay to completion tou observable.
     * That to ektelesei ayto molis perasei to 1 deuterolpeto alla to subscribe that kalesei h alliws to
     * function pou pairname sto suscribe tha kalestei prin ginei ayto.
     */
    // return this.offers.pipe(
    //   take(1),
    //   tap(offers => {
    //   setTimeout(() => {
    //     this._offers.next(offers.concat(newOffer));
    //   }, 1000);
    // }));

    /**
     * Valame pleon to database opote feugei apo edw kai paei pio panw 
     */
    // return this.offers.pipe(
    //   take(1),
    //   delay(1000),
    //   tap(offers => {
    //     this._offers.next(offers.concat(newOffer));
    //   })
    // );
  }

  addPlace(
    title: string,
    descpritpion: string,
    price: number,
    dateFrom: Date,
    dateTo: Date,
    location
  ) {
    let generateId: string;
    const newPlace = new Place(
      Math.random().toString(),
      title,
      descpritpion,
      "https://news.gtp.gr/wp-content/uploads/2019/01/Tritsis-Park.jpg",
      price,
      dateFrom,
      dateTo,
      this.authService.userId,
      location
    );

    return this.http.post<{name: string}>('https://ionic-angular-booking-ce888.firebaseio.com/places.json', {
      ...newPlace, id: null
    })
    .pipe(
      /**
       * to switchMap pairnei ena existing observable chain, kai soy gyrnaei ena neo observable pou meta
       * tha kanei replace to palio observable sta epomena vimata ayths ths alysidas
       */
      switchMap(resData => {
        generateId = resData.name;
        return this.places;
      }),
      take(1),
      /**
       * logo tou tap den asxoloumaste me to response to http twra alla me to this.places
       */
      tap(places => {
        newPlace.id = generateId;
        this._places.next(places.concat(newPlace));
      })
    );
  }

  updateOffer(placeId: string, title: string, description: string) {
    let updatedOffers: Offer[];
    return this.offers.pipe(
      take(1), 
      switchMap(offers => {
        if(!offers || offers.length <= 0)
        {
          return this.fetchOffers();
        }
        else 
        {
          return of(offers) ;
        }
      }),
      switchMap( offers => {
        const updatedOfferIndex = offers.findIndex(pl => pl.id === placeId);
        updatedOffers = [...offers];
        const oldOffer = updatedOffers[updatedOfferIndex];
        updatedOffers[updatedOfferIndex] = new Offer(
          oldOffer.id,
          title,
          description,
          oldOffer.price,
          oldOffer.imageUrl,
          oldOffer.availiableFrom,
          oldOffer.availiableTo,
          oldOffer.userId,
          oldOffer.location
        );
        return this.http.put(`https://ionic-angular-booking-ce888.firebaseio.com/offers/${placeId}.json`, 
          {...updatedOffers[updatedOfferIndex], id:null}
        );
      }),
      tap(resData => {
        console.log("Updating....",resData);
        this._offers.next(updatedOffers);
      })
      );

    // afou balame to firebase xreiazotan akomi mia allagi gia na mas fortwnei sto edit . Dhladh otan mpainane sto edit 
    // kai kaname ananewsi mas edeixne ta dedomena. An pigainame kai ta allazame kai patagame confirm , mas evgaze error. 
    // giati den eixe perasei apo tis proigoumenes selides na fortwsei ta dedomena. Opote an den ta exei pernaei apo thn prwti switchmap
    // kai meta apo thn epomenh gia na kanei thn diadikasia

    // return this.offers.pipe(
    //   take(1), 
    //   switchMap(offers => {
    //     const updatedOfferIndex = offers.findIndex(pl => pl.id === placeId);
    //     updatedOffers = [...offers];
    //     const oldOffer = updatedOffers[updatedOfferIndex];
    //     updatedOffers[updatedOfferIndex] = new Offer(
    //       oldOffer.id,
    //       title,
    //       description,
    //       oldOffer.price,
    //       oldOffer.imageUrl,
    //       oldOffer.availiableFrom,
    //       oldOffer.availiableTo,
    //       oldOffer.userId
    //     );
    //     return this.http.put(`https://ionic-angular-booking-ce888.firebaseio.com/offers/${placeId}.json`, 
    //       {...updatedOffers[updatedOfferIndex], id:null}
    //     );
    //   }),
    //   tap(resData => {
    //     console.log("Updating....",resData);
    //     this._offers.next(updatedOffers);
    //   })
    //   );



      // Prin valoume firebase kaname auto

    // return this.offers.pipe(
    //   take(1),
    //   tap(offers => {
    //     const updatedOfferIndex = offers.findIndex(pl => pl.id === placeId);
    //     const updatedOffers = [...offers];
    //     const oldOffer = updatedOffers[updatedOfferIndex];
    //     updatedOffers[updatedOfferIndex] = new Offer(
    //       oldOffer.id,
    //       title,
    //       description,
    //       oldOffer.price,
    //       oldOffer.imageUrl,
    //       oldOffer.availiableFrom,
    //       oldOffer.availiableTo,
    //       oldOffer.userId
    //     );
    //     this._offers.next(updatedOffers)
    //   })
    // );
  }

  updatePlace(placeId: string, title: string, description: string) 
  {
    let updatedPlaces: Place[];
    return this.places.pipe(
      take(1), 
      switchMap(places => {
        if(!places || places.length <= 0)
        {
          return this.fetchPlaces();
        }
        else 
        {
          return of(places) ;
        }
      }),
      switchMap(places => {
        const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
        updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imageUrl,
          oldPlace.price,
          oldPlace.availiableFrom,
          oldPlace.availiableTo,
          oldPlace.userId,
          oldPlace.location
        );
        return this.http.put(`https://ionic-angular-booking-ce888.firebaseio.com/places/${placeId}.json`, 
          {...updatedPlaces[updatedPlaceIndex], id:null}
        );
      }),
      tap(resData => {
        console.log("Updating....",resData);
        this._places.next(updatedPlaces);
      })
      );
  }




















}
