import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PlacesService } from '../../places.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {

    form: FormGroup;

  constructor(private placesService: PlacesService, private router: Router) { }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur', //otan xanei to focus pairnei thn timh
        validators: [Validators.required]
      }),
      description: new FormControl(null, {
        updateOn: 'blur', 
        validators: [Validators.required, Validators.maxLength(200)]
      }),
      price: new FormControl(null, {
        updateOn: 'blur', 
        validators: [Validators.required, Validators.min(1)]
      }),
      dateFrom: new FormControl(null, {
        updateOn: 'blur', 
        validators: [Validators.required]
      }),
      dateTo: new FormControl(null, {
        updateOn: 'blur', 
        validators: [Validators.required]
      })
    });


  }

  onCreateOffer()
  {
    if(!this.form.valid)
    {
      return ;
    }
    this.placesService.addOffer(
      this.form.value.title, 
      this.form.value.description, 
      +this.form.value.price, 
      new Date(this.form.value.dateFrom), 
      new Date(this.form.value.dateTo)
      );
    console.log("Createing Offered Place");
    console.log(this.form);
    this.form.reset();
    this.router.navigate(['/places/tabs/offers']);
  }

}
