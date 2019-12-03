import { Injectable } from '@angular/core';
import { Place } from './place.model';
import { Offer } from './offers/offer.model';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject } from 'rxjs';
import { take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  private _places = new BehaviorSubject<Place[]>([
    new Place('p1', 'Ilion', 'Dytika proasteia', 'https://www.gtp.gr/showphoto.asp?FN=/MGfiles/location/image13398[1770].jpg&w=650&H=370', 1000, new Date('2019-01-01'), new Date('2019-12-31'),'abc'),
    new Place('p2', 'Petroupoli', 'Dytika kai ayta', 'https://i.ytimg.com/vi/VSlw_tGF1GE/maxresdefault.jpg', 2000, new Date('2019-01-01'), new Date('2019-12-31'),'abc'),
    new Place('p3', 'Aigalew', 'Rakomeladika', 'http://www.athens-car-rental.com/wp-content/uploads/2016/09/EGALEO-CAR-RENTAL.png', 3000,new Date('2019-01-01'), new Date('2019-12-31'),'abc'),
    new Place('p4', 'Xaidari', 'Dytika kai ayta', 'https://i.ytimg.com/vi/VSlw_tGF1GE/maxresdefault.jpg', 2000,new Date('2019-01-01'), new Date('2019-12-31'),'abc'),
    new Place('p5', 'Agioi Anaruroi', 'Dytika kai ayta', 'https://i.ytimg.com/vi/VSlw_tGF1GE/maxresdefault.jpg', 2000,new Date('2019-01-01'), new Date('2019-12-31'),'abc'),
    new Place('p6', 'Kamatero', 'Dytika kai ayta', 'https://i.ytimg.com/vi/VSlw_tGF1GE/maxresdefault.jpg', 2000,new Date('2019-01-01'), new Date('2019-12-31'),'abc'),

  ]);

  private _offers = new BehaviorSubject<Offer[]>([
    new Offer('o1','PARE PARE 1' , 'Poly kali Profora 1', 4000, 'https://www.aggouria.net/wp-content/uploads/2016/07/ktiria-dubai-aggouria.net_.jpg',new Date('2019-01-01'), new Date('2019-12-31'),'abc'),
    new Offer('o2','PARE PARE 2' , 'Poly kali Profora 2', 5000, 'https://www.otherside.gr/wp-content/uploads/2011/03/psilotera-ktiria-05.jpg',new Date('2019-01-01'), new Date('2019-12-31'),'abc'),
    new Offer('o3','PARE PARE 3' , 'Poly kali Profora 3', 6000, 'https://slpress.gr/wp-content/uploads/2017/09/ktiria-barcelona-18.jpg',new Date('2019-01-01'), new Date('2019-12-31'),'abc'),
  ]); 

  constructor(private authService: AuthService) { }

  get places ()
  {
  //  return [...this._places];
  return this._places.asObservable();
  }

  get offers ()
  {
    return this._offers.asObservable();
  }

  getPlace(id: string)
  {
  //  return {...this._places.find( place => place.id === id)}
    return this.places.pipe(take(1), map(places => {
      return {...places.find( place => place.id === id)}
    }));
  }

  getOffer(id: string)
  {
  //  return {...this._offers.find( offer => offer.id === id)}
    return this.offers.pipe(take(1), map(offers => {
      return {...offers.find( place => place.id === id)}
    }));
  }

  addOffer(title: string, descpritpion: string, price: number, dateFrom: Date, dateTo: Date)
  {
    const newOffer = new Offer(
      Math.random().toString(), 
      title, 
      descpritpion, 
      price,
    'https://news.gtp.gr/wp-content/uploads/2019/01/Tritsis-Park.jpg', 
    dateFrom, 
    dateTo,
    this.authService.userId
    );
    /**
     * Tou leei na koitaxei sto offer subject poy exoume apo panw kai se parakalw kane subscribe se ayto 
     * alla pare ena object kai meta automata kane cancel to subscription
     * me to 'take' pairnei thn teleutaia lista me ta offers kai den akouei se melontika offers.
     */
    this.offers.pipe(take(1)).subscribe(offers => {
    this._offers.next(offers.concat(newOffer));
    });
  }

  addPlace(title: string, descpritpion: string, price: number, dateFrom: Date, dateTo: Date)
  {
    const newPlace = new Place(
      Math.random().toString(), 
      title, 
      descpritpion, 
    'https://news.gtp.gr/wp-content/uploads/2019/01/Tritsis-Park.jpg',
    price, 
    dateFrom, 
    dateTo,
    this.authService.userId
    );

   // this._places.push(newPlace);
   this.places.pipe(take(1)).subscribe(places => {
    this._places.next(places.concat(newPlace));
    });
  }
}
