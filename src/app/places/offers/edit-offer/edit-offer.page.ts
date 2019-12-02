import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Offer } from '../offer.model';
import { PlacesService } from '../../places.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit {

  form: FormGroup;

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

        //to theloume gia na parei ta dedomena apo to offer
        this.form = new FormGroup ({
          title: new FormControl(this.offer.title, {
            updateOn: 'blur', //otan xanei to focus pairnei thn timh
            validators: [Validators.required]
          }),
          description: new FormControl(this.offer.description, {
            updateOn: 'blur',
            validators: [Validators.required, Validators.maxLength(200)]
          }),
        });
      }
    );
  }

  onUpdateOffer()
  {
    if(!this.form.valid)
    {
      return ;
    }
    console.log(this.form);
  }

}
