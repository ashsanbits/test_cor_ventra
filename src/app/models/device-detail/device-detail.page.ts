import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertController, ModalController, NavParams, Platform } from '@ionic/angular';
import { Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';

@Component({
  selector: 'app-device-detail',
  templateUrl: './device-detail.page.html',
  styleUrls: ['./device-detail.page.scss'],
})
export class DeviceDetailPage implements OnInit {
  ngVal = "1";
  public value: Observable<number>;
  device: any;
  username = localStorage.getItem('ventra_user')
  password = localStorage.getItem('ventra_pass')
  url: any;
  channels = [];
  speedInKph: any = 0;
  speedInMph: any = 0;
  speed_unit = localStorage.getItem('speed_unit');
  angle: string;
  constructor(
    private modalCtrl: ModalController,
    private _navParams: NavParams,
    public sanitizer: DomSanitizer,
    private screenOrientation: ScreenOrientation,
    private platform: Platform,
  ) { }
  
  ngOnInit() {
    this.platform.backButton.subscribe(() => {
      this.closeModal();
    });
    this.platform.ready().then(res => {
      if(this.platform.is('cordova')) {
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
      }
    }) 
    this.device = this._navParams.get('data');
    const u = 'https://www.ventracloud.com/live/' + this.device.deviceid + '/'+this.username + '/' + this.password;
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(u);
    
    if (this.device.gpsdata) {
      this.angle = this.getCardinalDirection(this.device.gpsdata.trackingAngle);
      let val = this.device.gpsdata.speedInKmh
      this.speedInKph = val;
      this.speedInMph = val * 0.6213711922;
    } else {
      this.speedInMph = 0;
    }

    for (let i = 0; i < this.device.channel; i++) {
      this.channels.push(i + 1);
    }
  }
  closeModal() {
    console.clear();
    this.platform.ready().then(res => {
      if(this.platform.is('cordova')) {
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
      }
    }) 
    this.modalCtrl.dismiss();
  }
  changeChannel(value) {
    if(value == 'all') {
      const u = 'https://www.ventracloud.com/live/' + this.device.deviceid + '/'+this.username + '/' + this.password;
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(u);
    } else {
      const u = 'https://www.ventracloud.com/live/' + this.device.deviceid + '@' + value + '/' + this.username + '/' + this.password;
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(u);
    }
  }
  ChangeSpeedUnit(ev) {
    this.speed_unit = ev.detail.value;
    console.log(this.speed_unit)
    clearInterval()
    if (this.speed_unit = 'mph') {
      let min = this.speedInMph - 1;
      if (this.speedInMph <= 1) {
        this.value = interval(750).pipe(
          map(() => Math.random() * 0)
        );
      } else {
        this.value = interval(750).pipe(
          map(() => Math.random() * (this.speedInMph - min) + min)
        );
      }
    } else {
      let min = this.speedInKph - 1;
      if (this.speedInKph <= 1) {
        this.value = interval(750).pipe(
          map(() => Math.random() * 0)
        );
      } else {
        this.value = interval(750).pipe(
          map(() => Math.random() * (this.speedInKph - min) + min)
        );
      }
    }
  }
  ngAfterViewInit() {
    // const script = document.createElement('script');
    // script.src = 'assets/gauge.min.js';
    // document.body.appendChild(script);
    
    //   document.getElementById('speedsss').setAttribute('data-value', this.speedInMph);
    // document.getElementById('angle').setAttribute('data-value', this.device.gpsdata.trackingAngle);
    // let min = this.speedInMph - 1;
    //   if (val <= 1) {
    //     this.value = interval(750).pipe(
    //       map(() => Math.random() * 0)
    //     );
    //   } else {
    //     this.value = interval(750).pipe(
    //       map(() => Math.random() * (this.speedInMph - min) + min)
    //     );
    //   }
    // }
  }
  getCardinalDirection(angle) {
    const directions = ['↑ N', '↗ NE', '→ E', '↘ SE', '↓ S', '↙ SW', '← W', '↖ NW'];
    return directions[Math.round(angle / 45) % 8];
}
}
