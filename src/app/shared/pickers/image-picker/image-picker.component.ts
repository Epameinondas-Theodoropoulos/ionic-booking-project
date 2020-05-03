import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, Input } from '@angular/core';
import { Plugins, Capacitor, CameraResultType, CameraSource } from '@capacitor/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {

  @Output() imagePick = new EventEmitter<string | File>();
  @ViewChild('filePicker',{static: false}) filePickerRef: ElementRef;
  @Input() showPreview = false;

  selectedImage: string;
  usePicker = false;

  constructor(private platform: Platform) { }

  ngOnInit() {
    console.log('Mobile: ',this.platform.is('mobile'));
    console.log('Hybrid: ',this.platform.is('hybrid'));
    console.log('Ios: ',this.platform.is('ios'));
    console.log('Android: ',this.platform.is('android'));
    console.log('Desktop: ',this.platform.is('desktop'));

    // me ayto ton elegxo xeroume oti trexei se desktop device
    if(this.platform.is('mobile') && !this.platform.is('hybrid') || this.platform.is('desktop'))
    {
      this.usePicker = true;
    }
  }

  onFileChosen(event: Event)
  {
    console.log(event);
    const pickedFile = (event.target as HTMLInputElement).files[0]; // h typescript den to xerei oti exei to files , opote to metatrepoume
    if(!pickedFile)
    {
      return;
    }
    const fr = new FileReader();
    fr.onload = () => {
      const dataUrl = fr.result.toString();
      this.selectedImage = dataUrl;
      this.imagePick.emit(pickedFile);
    }
    fr.readAsDataURL(pickedFile);
  }

  onPickImage()
  {
    // etsi opws to eixame prin thewrousame oti den yparxei kamera sto desktop opote tha prepei na epilexei opwsdhpote file
    // if(!Capacitor.isPluginAvailable('Camera') || this.usePicker)
    if(!Capacitor.isPluginAvailable('Camera') )
    {
      this.filePickerRef.nativeElement.click();
      return;
    }

    Plugins.Camera.getPhoto({
      quality: 50, //max 100 minimum 1
      source: CameraSource.Prompt, //epilegei o user an tha xrisimopoiei thn gallery or thn kamera
      correctOrientation: true,
      height: 320,
      width: 200,
      resultType: CameraResultType.Base64
    }).then(image => {
      this.selectedImage = "data:image/jpeg;base64,"+image.base64String;
      this.imagePick.emit(image.base64String);
    }).catch(error => {
      console.log(error);

      // to vgalame apo to apo panw if. to valame edw giati valame ena plugin sto opoio mporeis na xrisimopoihseis thn kamera to desktop
      // an theleis. 
      if(this.usePicker)
      {
        this.filePickerRef.nativeElement.click();
      }
      

      return false;
    });
  }






}
