import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PlacesService } from '../../places.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { OfferLocation } from '../../location.model';
import { switchMap } from 'rxjs/operators';


function base64toBlob(base64Data, contentType) {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {

    form: FormGroup;

  constructor(private placesService: PlacesService, private router: Router, private loadingCtrl: LoadingController) { }

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
      }),
      location: new FormControl(null, {
        validators: [Validators.required]
      }),
      image: new FormControl(null)
    });


  }

  onLocationPicked(location: OfferLocation)
  {
    this.form.patchValue({location: location});
  }

  onImagePicked(imageData: string | File)
  {
    let imageFile;
    if(typeof imageData === 'string')
    {
      try{
      /**
       * this is basivally a prefix that the images generated by the camera plugin will have.
       * And thi basically turn it into an invalid base64 string that can be converted by this method.
       * So we have to remove it , which is what we are doing here
       */
         imageFile = base64toBlob(
        imageData.replace('data:image/jpeg;base64,', ''), 
        'image/jpeg'
        );
      }
      catch (error){
        console.log(error);
        return;
      }

    }
    else{
      imageFile = imageData;
    }

    this.form.patchValue({image: imageFile});
  }

  onCreateOffer()
  {
    if(!this.form.valid || !this.form.get('image').value)
    {
      return ;
    }
    this.loadingCtrl.create({
      message: 'Creating place...'
    })
    .then(loadingEl => {
      console.log(this.form.value);
      loadingEl.present();

      this.placesService.uploadImage(this.form.get('image').value) //xeroume oti einai typou file giati to kaname convert apo panw
      .pipe(
        switchMap(uploadRes => {
          return this.placesService.addPlace(
            this.form.value.title, 
            this.form.value.description, 
            +this.form.value.price, 
            new Date(this.form.value.dateFrom), 
            new Date(this.form.value.dateTo),
            this.form.value.location,
            uploadRes.imageUrl
            );
        }))
        .subscribe(() => {
          loadingEl.dismiss();
          console.log("Createing Offered Place");
          console.log(this.form);
          this.form.reset();
          this.router.navigate(['/places/tabs/offers']);
        });

        // valame twra na anevazei thn fwtografia. opote metaferoume ekei thn diadikasia gia na paroume to link ths
      // this.placesService.addOffer(
      //   this.form.value.title, 
      //   this.form.value.description, 
      //   +this.form.value.price, 
      //   new Date(this.form.value.dateFrom), 
      //   new Date(this.form.value.dateTo),
      //   this.form.value.location
      //   ).subscribe(() => {
      //     loadingEl.dismiss();
      //     console.log("Createing Offered Place");
      //     console.log(this.form);
      //     this.form.reset();
      //     this.router.navigate(['/places/tabs/offers']);
      //   });
    });



  }

}
