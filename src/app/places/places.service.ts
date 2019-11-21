import { Injectable } from '@angular/core';
import { Place } from './place.model';
import { Offer } from './offers/offer.model';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  private _places: Place[] = [
    new Place('p1', 'Ilion', 'Dytika proasteia', 'https://www.gtp.gr/showphoto.asp?FN=/MGfiles/location/image13398[1770].jpg&w=650&H=370', 1000),
    new Place('p2', 'Petroupoli', 'Dytika kai ayta', 'https://i.ytimg.com/vi/VSlw_tGF1GE/maxresdefault.jpg', 2000),
    new Place('p3', 'Aigalew', 'Rakomeladika', 'data:image/jpeg;base64,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', 3000)
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
