import { Injectable } from '@angular/core';
import { Place } from './place.model';
import { Offer } from './offers/offer.model';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  private _places: Place[] = [
    new Place('p1', 'Ilion', 'Dytika proasteia', 'https://www.gtp.gr/showphoto.asp?FN=/MGfiles/location/image13398[1770].jpg&w=650&H=370', 1000, new Date('2019-01-01'), new Date('2019-12-31'),'abc'),
    new Place('p2', 'Petroupoli', 'Dytika kai ayta', 'https://i.ytimg.com/vi/VSlw_tGF1GE/maxresdefault.jpg', 2000, new Date('2019-01-01'), new Date('2019-12-31'),'abc'),
    new Place('p3', 'Aigalew', 'Rakomeladika', 'http://www.athens-car-rental.com/wp-content/uploads/2016/09/EGALEO-CAR-RENTAL.png', 3000,new Date('2019-01-01'), new Date('2019-12-31'),'abc'),
    new Place('p4', 'Xaidari', 'Dytika kai ayta', 'https://i.ytimg.com/vi/VSlw_tGF1GE/maxresdefault.jpg', 2000,new Date('2019-01-01'), new Date('2019-12-31'),'abc'),
    new Place('p5', 'Agioi Anaruroi', 'Dytika kai ayta', 'https://i.ytimg.com/vi/VSlw_tGF1GE/maxresdefault.jpg', 2000,new Date('2019-01-01'), new Date('2019-12-31'),'abc'),
    new Place('p6', 'Kamatero', 'Dytika kai ayta', 'https://i.ytimg.com/vi/VSlw_tGF1GE/maxresdefault.jpg', 2000,new Date('2019-01-01'), new Date('2019-12-31'),'abc'),

  ];

  private _offers: Offer[] = [
    new Offer('o1','PARE PARE 1' , 'Poly kali Profora 1', 4000, 'https://www.aggouria.net/wp-content/uploads/2016/07/ktiria-dubai-aggouria.net_.jpg'),
    new Offer('o2','PARE PARE 2' , 'Poly kali Profora 2', 5000, 'https://www.otherside.gr/wp-content/uploads/2011/03/psilotera-ktiria-05.jpg'),
    new Offer('o3','PARE PARE 3' , 'Poly kali Profora 3', 6000, 'https://slpress.gr/wp-content/uploads/2017/09/ktiria-barcelona-18.jpg'),
  ]

  constructor() { }

  get places ()
  {
    return [...this._places];
  }

  get offers ()
  {
    return [...this._offers];
  }

  getPlace(id: string)
  {
    return {...this._places.find( place => place.id === id)}
  }

  getOffer(id: string)
  {
    return {...this._offers.find( offer => offer.id === id)}
  }
}
