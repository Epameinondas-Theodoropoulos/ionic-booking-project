import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Place } from 'src/app/places/place.model';
import { ModalController } from '@ionic/angular';
import { __importDefault } from 'tslib';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {

  @Input() selectedPlace: Place;
  @Input() selectedMode: 'select' | 'random';
  @ViewChild('f', {static: false}) form: NgForm;

  startDate: string;
  endDate: string;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    const availiableFrom = new Date(this.selectedPlace.availiableFrom);
    const availiableTo = new Date(this.selectedPlace.availiableTo);
    if(this.selectedMode === 'random')
    {
      this.startDate = 
      new Date(
      availiableFrom.getTime() + 
      Math.random() * 
      (availiableTo.getTime() - 
      7 * 24 * 60 * 60 * 1000 - 
      availiableFrom.getTime())
      ).toISOString();

      this.endDate = 
      new Date(
      new Date ( this.startDate).getTime() + 
      Math.random() * (new Date(this.startDate).getTime() + 6 * 24 * 60 * 60 * 1000 
      - new Date(this.startDate).getTime())
      ).toISOString();
    }

  }

  onBookPlace()
  {
    if(!this.form.valid || !this.datesValid())
    {
      return;
    }

    this.modalCtrl.dismiss({bookingData: {
      firstName: this.form.value['first-name'],
      lastName: this.form.value['last-name'],
      guestNumber: +this.form.value['guest-number'],
      startDate: new Date (this.form.value['date-from']),
      endDate: new Date(this.form.value['date-to'])

    }}, 'confirm'); // role edw einai to confirm
  }

  onCancel()
  {
    this.modalCtrl.dismiss(null, 'cancel'); // vazoume oti theloume apo data, exei meta to role: kai to id 
  }

  datesValid()
  {
    if (this.form != null) {
      const startDate = new Date(this.form.value['date-from']);
      const endDate = new Date(this.form.value['date-to']);
      return endDate > startDate;
    }


  }

}
