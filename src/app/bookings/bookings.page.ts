import { Component, OnInit, OnDestroy } from '@angular/core';
import { BookingsService } from './booking.service';
import { Booking } from './booking.model';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {

  loadedBookings: Booking [];
  bookingSub: Subscription;
  isLoading = false;

  constructor(private bookingsService: BookingsService, private loadingCtrl: LoadingController) { }

  ngOnInit() {
  //  this.loadedBookings = this.bookingsService.bookings;
    this.bookingSub = this.bookingsService.bookings.subscribe(bookings => {
    this.loadedBookings = bookings;
  })
  }

  ionViewWillEnter()
  {
    this.isLoading = true
    this.bookingsService.fetchBookings().subscribe(() => {
      this.isLoading = false;
    });
  }

  onCancelBooking(bookingId: string, slidingBooking: IonItemSliding)
  {
    slidingBooking.close();
    //cancel booking witth booking id
    this.loadingCtrl.create({
      message: 'Cancelling...'
    })
    .then(loadingEl => {
      loadingEl.present();
      this.bookingsService.cancelBooking(bookingId).subscribe(() => {
        loadingEl.dismiss();
      });
    });
    
  }

  ngOnDestroy()
  {
    if(this.bookingSub)
    {
      this.bookingSub.unsubscribe();
    }
  }

}
