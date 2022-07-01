import { Component } from '@angular/core';
import { AlertController, MenuController, ModalController, Platform } from '@ionic/angular';
import { DeviceDetailPage } from '../models/device-detail/device-detail.page';
import { HttpService } from '../services/http.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { SpinnerDialog } from '@awesome-cordova-plugins/spinner-dialog/ngx';
import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  user = localStorage.getItem('user_type');
  title: string = 'AGM project';
  latitude: number = 47.87692963532345;
  longitude: number = -97.65047823437502;
  zoom: number = 4;
  online = true;
  offline = false;
  idle = false;
  username = localStorage.getItem('ventra_user')
  password = localStorage.getItem('ventra_pass')
  onlineDevices: any = [];
  offlineDevices: any = [];
  icon: any;
  onDeviceIcon = {
    labelOrigin: { x: 30, y: 65 },
    url: "./assets/online.svg",
    scaledSize: {
      width: 60,
      height: 80,
      anchor: { x: 19, y: 19 }
    }
  }
  offDeviceIcon = {
    labelOrigin: { x: 30, y: 65 },
    url: "./assets/offline.svg",
    scaledSize: {
      width: 60,
      height: 80,
      anchor: { x: 19, y: 19 }
    }
  }
  device: any;
  deviceId = localStorage.getItem('deviceid')
  searchDevices: any = [];
  style = 'deviceid'
  isPopoverOpen = false;
  pop_speed: any;
  pop_name: any;
  pop_address: any;
  pop_item: any;
  constructor(
    private api: HttpService,
    private modalCtrl: ModalController,
    private menu: MenuController,
    private platform: Platform,
    private spinner: SpinnerDialog,
    private alert: AlertController,
    private route: Router
  ) { }

  ngOnInit() {
    if(!localStorage.getItem('speed_unit')) {
      localStorage.setItem('speed_unit','mph');
    }
    this.menu.enable(true)
    this.getProfile();
    if(this.platform.is('android') || this.platform.is('ios')) {
      // this.notifications();
    }
  }
  notifications() {
    FCM.onNotification().subscribe(data => {
      this.api.presentToast(data.body);
    });
  }
  async getProfile() {
    let params = {
      email: localStorage.getItem('email')
    }
    this.api.get('getProfile',params,false).subscribe(async res => {
      if(res.user.app_fcm_token == null) {
        localStorage.clear();
        this.route.navigate(['login'], { replaceUrl: true });
      }
      if(res.user.remember_token == null) {
        const alert = await this.alert.create({
          cssClass: 'my-custom-class',
          header: 'Please update your temporary password',
          mode: 'ios',
          backdropDismiss: false,
          inputs: [
            {
              name: 'password',
              type: 'password',
              placeholder: 'Password'
            }
          ],
          buttons: [
            {
              text: 'Ask Later',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {
              }
            }, {
              text: 'Update',
              handler: (data) => {
                if(data.password == '') {
                  this.api.presentToast('Password is required');
                } else {
                  data.email = localStorage.getItem('email');
                  this.api.post('updatePasswordCheck',data,true).subscribe((ressss) => {
                    this.api.presentToast('Password updated sucessfully');
                  })
                }
              }
            }
          ]
        });
        await alert.present();
      }
    })
  }
  ionViewWillEnter() {
    if (this.user == 'admin') {
      this.gpsdevices()
    } else {
      this.getDevices();
    }
  }
  getDevices() {
    this.api.get('getDevices',null,true).subscribe(res => {
      localStorage.setItem('driver_devices',JSON.stringify(res.devices));
      this.gpsDriverdevice();
    })
  }
  changeButtonStatus(check) {
    this.zoom = 2;
    if (check == 'on') {
      this.searchDevices = this.onlineDevices;
      this.offline = false;
      this.online = true;
      if (this.onlineDevices.length > 0) {
        this.latitude = this.onlineDevices[0]?.gpsdata?.lat;
        this.longitude = this.onlineDevices[0]?.gpsdata?.lng;
      } else {
        this.latitude = 45.349492204568115;
        this.longitude = -75.8056184300331;
      }
    } else {
      this.searchDevices = this.offlineDevices;
      this.offline = true;
      this.online = false;
      if (this.offlineDevices.length > 0) {
        this.latitude = this.offlineDevices[0]?.gpsdata?.lat;
        this.longitude = this.offlineDevices[0]?.gpsdata?.lng;
      } else {
        this.latitude = 45.349492204568115;
        this.longitude = -75.8056184300331;
      }
    }
  }
  gpsdevices() {
    this.zoom = 2;
    this.onlineDevices = [];
    this.offlineDevices = [];
    const body = 'username=' + this.username + '&password=' + this.password;
    this.api.ventra_post('gkdevice/alllist', body, true).subscribe(data => {
      let i = 1;
      data.forEach(element => {
        if (element.status == 1) {
          this.onlineDevices.push(element)
          if (element.gpsdata) {
            if (i == 1) {
              this.latitude = element?.gpsdata?.lat;
              this.longitude = element?.gpsdata?.lng;
            }
            i++;
          }
        } else {
          this.offlineDevices.push(element)
        }
      });
      localStorage.setItem('devices', JSON.stringify(data))
      localStorage.setItem('online', JSON.stringify(this.onlineDevices))
      localStorage.setItem('offline', JSON.stringify(this.offlineDevices))
      this.searchDevices = this.onlineDevices;
    })
  }
  gpsDriverdevice() {
    this.api.spinner.show();
    let datas = [];
    let devices = JSON.parse(localStorage.getItem('driver_devices'));
    this.zoom = 2;
    this.onlineDevices = [];
    this.offlineDevices = [];
    devices.forEach((element,key) => {
      const body = 'username=' + this.username + '&password=' + this.password + '&deviceid=' + element.deviceid;
      this.api.ventra_post('gkdevice/device', body, false).subscribe(data => {
        data.deviceid = element.deviceid;
        datas.push(data);
        if (data.status == 1) {
          let i = 1;
          this.onlineDevices.push(data);
          if (data.gpsdata) {
            if (i == 1) {
              this.latitude = data?.gpsdata?.lat;
              this.longitude = data?.gpsdata?.lng;
            }
            i++;
          }
        } else {
          this.offlineDevices.push(data);
        }
        if(key == devices.length - 1) {
          localStorage.setItem('devices', JSON.stringify(datas))
          localStorage.setItem('online', JSON.stringify(this.onlineDevices))
          localStorage.setItem('offline', JSON.stringify(this.offlineDevices))
          this.searchDevices = this.onlineDevices;
          this.api.spinner.hide();
        }
      })
    });
  }
  closePopover() {
    this.isPopoverOpen = false;
  }
  async deviceDetail(item) {
    if (item.status == 0) {
      this.api.presentAlertConfirm('System is offline!','assets/gps_signal.png')
      // this.api.presentToast('System is offline.')
    } else {
      this.spinner.show();
      const unit = localStorage.getItem('speed_unit');
      if(unit == 'mph') {
        this.pop_speed =  (item.gpsdata.speedInKmh * 0.6213711922).toFixed(2) + '  MPH'
      } else {
        this.pop_speed = item.gpsdata.speedInKmh + ' KMH'
      }
      const latlng = { lat: item.gpsdata.lat, lng: item.gpsdata.lng }
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: latlng }, (results, status) => {
        this.spinner.hide();
        this.isPopoverOpen = true;
        if (status == google.maps.GeocoderStatus.OK) {
          if (results[0] != null) {
            this.pop_name= item.drivername != "" ? item.drivername : item.deviceid;
            this.pop_address = results[0].formatted_address
            item.formatted_address = results[0].formatted_address;
            this.pop_item = item;

            // Swal.fire({
            //   html:
            //     '<h6 style="text-align:left;margin:0px">Vehicle Information</h6><hr><div style="text-align:left"><h6 style="color:red;margin:0px"><b>Driver Name</b></h6><h6 style="margin:0px">' + name + '</h6><hr><h6 style="color:red;margin:0px"><b>Driver Location</b></h6><h6 style="margin:0px">' + results[0].formatted_address + '</h6><hr><h6 style="color:red;margin:0px"><b>Driver Speed</b></h6><h6 >' + speed + ' </h6></div>',
            //   showCloseButton: true,
            //   showCancelButton: false,
            //   confirmButtonColor: '#e0232b',
            //   focusConfirm: false,
            //   confirmButtonText:
            //     'View Full Details',
            // }).then(async data => {
            //   if (data.value) {
            //     const modal = await this.modalCtrl.create({
            //       component: DeviceDetailPage,
            //       cssClass: 'my-custom-class',
            //       componentProps: { data: item }
            //     });
            //     modal.onDidDismiss().then(data => {
            //     });
            //     return await modal.present();
            //   }
            // })
          } else {
            alert('address not found')
          }
        }
      });
    }
  }
  async openDetailmodal() {
    const modal = await this.modalCtrl.create({
      component: DeviceDetailPage,
      cssClass: 'my-custom-class',
      componentProps: { data: this.pop_item }
    });
    modal.onDidDismiss().then(data => {
    });
    return await modal.present();
  }
  changeDevice(device) {
    this.zoom = 20; 
    if (this.online) {
      let on = this.onlineDevices.filter(item => {
        return item.deviceid.toLowerCase().includes(device.detail.value.toLowerCase());
      })
      if (on[0].gpsdata) {
        this.latitude = on[0]?.gpsdata?.lat;
        this.longitude = on[0]?.gpsdata?.lng;
      } else {
        this.api.presentAlertConfirm('No GPS signal found! <br><br> Please select List View for live feed','assets/gps_signal.png')
      }

    } else {
      let off = this.offlineDevices.filter(item => {
        return item.deviceid.toLowerCase().includes(device.detail.value.toLowerCase());
      })
      if (off[0].gpsdata) {
        this.latitude = off[0]?.gpsdata?.lat;
        this.longitude = off[0]?.gpsdata?.lng;
      } else {
        this.api.presentAlertConfirm('No GPS signal found! <br><br> Please select List View for live feed','assets/gps_signal.png')
      }

    }

  }
}
