import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NavController, LoadingController } from "@ionic/angular";
import { Offer } from "../offer.model";
import { PlacesService } from "../../places.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Subscription } from "rxjs";

@Component({
  selector: "app-edit-offer",
  templateUrl: "./edit-offer.page.html",
  styleUrls: ["./edit-offer.page.scss"]
})
export class EditOfferPage implements OnInit, OnDestroy {
  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private placesService: PlacesService,
    private router: Router,
    private loadingCtrl: LoadingController
  ) {}

  offer: Offer;
  offerSub: Subscription;
  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has("placeId")) {
        this.navCtrl.navigateBack("/places/tabs/offers");
        return;
      }
      // this.offer = this.placesService.getOffer(paramMap.get('placeId'));
      this.offerSub = this.placesService
        .getOffer(paramMap.get("placeId"))
        .subscribe(offer => {
          this.offer = offer;
          //to theloume gia na parei ta dedomena apo to offer
          this.form = new FormGroup({
            title: new FormControl(this.offer.title, {
              updateOn: "blur", //otan xanei to focus pairnei thn timh
              validators: [Validators.required]
            }),
            description: new FormControl(this.offer.description, {
              updateOn: "blur",
              validators: [Validators.required, Validators.maxLength(200)]
            })
          });
        });
    });
  }

  onUpdateOffer() {
    if (!this.form.valid) {
      return;
    }
    this.loadingCtrl.create({
      message: 'Updating Offer...'
    }).then(loadingEl => {
      loadingEl.present();
      this.placesService.updateOffer(
        this.offer.id,
        this.form.value.title,
        this.form.value.description
      ).subscribe(()=>{
        loadingEl.dismiss();
        this.form.reset();
        this.router.navigate(['/places/tabs/offers']);
      });
    })

    console.log(this.form);
  }

  onUpdatePlace() {
    if (!this.form.valid) {
      return;
    }
    this.loadingCtrl.create({
      message: 'Updating Place...'
    }).then(loadingEl => {
      loadingEl.present();
      this.placesService.updatePlace(
        this.offer.id,
        this.form.value.title,
        this.form.value.description
      ).subscribe(()=>{
        loadingEl.dismiss();
        this.form.reset();
        this.router.navigate(['/places']);
      });
    })

    console.log(this.form);
  }

  ngOnDestroy() {
    if (this.offerSub) {
      this.offerSub.unsubscribe();
    }
  }
}
