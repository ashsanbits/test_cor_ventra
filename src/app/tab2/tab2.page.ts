import { Component, OnInit } from '@angular/core';
import { SpinnerDialog } from '@awesome-cordova-plugins/spinner-dialog/ngx';
import { ModalController, Platform } from '@ionic/angular';
import { DeviceDetailPage } from '../models/device-detail/device-detail.page';
import { HttpService } from '../services/http.service';
declare var google
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{
  online: any;
  offline: any;
  devices: any;
  searchDevices: any;
  segment = 'online';
  user = localStorage.getItem('user_type');
  device = localStorage.getItem('deviceid');
  username = localStorage.getItem('ventra_user')
  password = localStorage.getItem('ventra_pass')
  constructor(
    private modalCtrl: ModalController,
    private api: HttpService,
    private spinner: SpinnerDialog
    
  ) {}
  ngOnInit() {
    
  }
  ionViewWillEnter() {
    if(this.user == 'admin') {
      this.api.showLoader();
      setTimeout(() => {
        this.api.hideLoader();
        this.segment = 'online';
        this.online = JSON.parse(localStorage.getItem('online'));
        this.devices = this.online;
        this.searchDevices = this.online;
        this.offline = JSON.parse(localStorage.getItem('offline'));
      }, 500);
    } else {
        this.segment = 'online';
        this.gpsDriverdevice();
    }  
  }
  gpsDriverdevice() {
    this.api.spinner.show();
    let datas = [];
    let devices = JSON.parse(localStorage.getItem('driver_devices'));
    this.online = [];
    this.offline = [];
    devices.forEach((element,key) => {
      const body = 'username=' + this.username + '&password=' + this.password + '&deviceid=' + element.deviceid;
      this.api.ventra_post('gkdevice/device', body, false).subscribe(data => {
        data.deviceid = element.deviceid;
        datas.push(data);
        if (data.status == 1) {
          this.online.push(data);
        } else {
          this.offline.push(data);
        }
        if(key == devices.length - 1) {
          this.devices = this.online;
          this.api.spinner.hide();
        }
      })
    });
  }
  segmentChanged(ev) {
    if(ev == 'online') {
      this.devices = this.online;
      this.searchDevices = this.online;
    } else {
      this.devices = this.offline;
      this.searchDevices = this.offline;
    }
  }
  async deviceDetail(item) {
    if(item.status == 0) {
      this.api.presentAlertConfirm('System is offline!','assets/gps_signal.png')
      // this.api.presentToast('System is offline')
    } else {
      if(item.gpsdata) {
        this.spinner.show()
        const latlng = { lat: item.gpsdata.lat, lng: item.gpsdata.lng }
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: latlng }, async (results, status) => {
          this.spinner.hide()
          if (status == google.maps.GeocoderStatus.OK) {
            if (results[0] != null) {
              let name = item.drivername != "" ? item.drivername : item.deviceid;
              item.formatted_address = results[0].formatted_address
              const modal = await this.modalCtrl.create({
                component: DeviceDetailPage,
                cssClass: 'my-custom-class',
                componentProps: { data: item }
              });
              modal.onDidDismiss().then(data => {
              });
              return await modal.present();
            } else {
              alert('address not found')
            }
          }
        });
      } else {
          item.formatted_address = 'No GPS Signal Found'
          const modal = await this.modalCtrl.create({
            component: DeviceDetailPage,
            cssClass: 'my-custom-class',
            componentProps: { data: item }
          });
          modal.onDidDismiss().then(data => {
          });
          return await modal.present();
      }
    }
  }
  search(ev) {
    const val = ev.target.value;
    if(val == '') {
      this.devices = this.searchDevices
    }else {
      this.devices = [];
      let device = this.searchDevices.filter((item: any) => {
        return item.deviceid.toLowerCase().search(val.toLowerCase()) >= 0;
      });
      let device1 = this.searchDevices.filter((item: any) => {
        return item.drivername.toLowerCase().search(val.toLowerCase()) >= 0;
      });
      for(let i=0;i<device.length;i++){
        if(this.devices.indexOf(device[i]) == -1)
           this.devices.push(device[i])
      }
      for(let i=0;i<device1.length;i++){
        if(this.devices.indexOf(device1[i]) == -1)
           this.devices.push(device1[i])
      }
    }
   
  }
  onClear(ev) {
    this.devices = this.searchDevices;
  }
}
