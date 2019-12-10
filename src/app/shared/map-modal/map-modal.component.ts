import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2, OnDestroy, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { environment} from '../../../environments/environment';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('map',{static: false}) mapElementRef: ElementRef;
  clickListener: any;
  googleMaps: any;
  @Input() center = {lat: 38.037804, lng: 23.705681};
  @Input() selectable = true;
  @Input() closeButtonText = 'Cancel';
  @Input() title = "Pick Location";

  constructor(private modalCtrl: ModalController, private renderer: Renderer2) { }

  ngOnInit() {}

  ngAfterViewInit()
  {
    this.getGoogleMaps()
    .then(googleMaps => {
      this.googleMaps = googleMaps; // to valame gia na to xrisimopooihsoume sthn onDestroy
      const mapEl  = this.mapElementRef.nativeElement;
      const map = new googleMaps.Map(mapEl, {
        center: this.center, 
        zoom: 16
      });

      //molis exei ginei load o map tote tha ektelestei
      googleMaps.event.addListenerOnce(map, 'idle', () => {
        this.renderer.addClass(mapEl, 'visible');
      });

      if(this.selectable)
      {
      //otan kanoume click ston xart gia na parei mia topothesia
      this.clickListener = map.addListener('click', event => {
        const selectedCoords = { 
          lat: event.latLng.lat()  , 
          lng: event.latLng.lng()
        };
        this.modalCtrl.dismiss(selectedCoords);
      });
      }
      else {
        const marker = new googleMaps.Marker({
          position: this.center,
          map: map,
          title: "Picked Location"
        });
        marker.setMap(map);
      }

    })
    .catch(err => {
      console.log(err);
    });
  }

  //to vfazoume giati mporei na dhmiourghse memory leak
  ngOnDestroy()
  {
    if(this.clickListener)
    {
      this.googleMaps.event.removeListener(this.clickListener);
    }
  }

  onCancel()
  {
    this.modalCtrl.dismiss();
  }

  private getGoogleMaps(): Promise<any>
  {
    const win = window as any;
    const googleModule = win.google; //thn prwti fora den tha einai diathsimo. tha einai undefined
    if(googleModule && googleModule.maps)
    {
      return Promise.resolve(googleModule.maps);
    }
    //otan den to exoume paei edw
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src='https://maps.googleapis.com/maps/api/js?key='+environment.googleMapsAPIKey; //https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        const loadedGoogleModule = win.google;
        if(loadedGoogleModule && loadedGoogleModule.maps)
        {
          resolve(loadedGoogleModule.maps);
        }
        else {
          reject('Google maps SDK not availiable');
        }
      }
    });
  }

}
