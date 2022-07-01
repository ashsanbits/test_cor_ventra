import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ProfilePage } from '../models/profile/profile.page';
import { UpdatePasswordPage } from '../models/update-password/update-password.page';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {
  speedUnit = localStorage.getItem('speed_unit');
  overspeed_notification: any;
  event_notification: any;
  constructor(
    private modal: ModalController,
    private api: HttpService
  ) { }

  ngOnInit() {
    this.getProfile();
  }
  ionViewWillEnter() {
    this.getProfile();
  }
  getProfile() {
    let params = {
      email: localStorage.getItem('email')
    }
    this.api.get('getProfile',params,false).subscribe(async res => {
      this.overspeed_notification = String(res.user.speed_dashboard);
      if(JSON.parse(res.user.event_notification).length != 0) {
        this.event_notification = JSON.parse(res.user.event_notification);
      }
    })
  }
  async openProfile() {
    const modal = await this.modal.create({
      component: ProfilePage,
      cssClass: 'my-custom-class',
      componentProps: { }
    });
    modal.onDidDismiss().then(data => {
    });
    return await modal.present();
  }
  async updatePassword() {
    const modal = await this.modal.create({
      component: UpdatePasswordPage,
      cssClass: 'my-custom-class',
      componentProps: { }
    });
    modal.onDidDismiss().then(data => {
    });
    return await modal.present();
  }
  changeUnit(ev) {
      localStorage.setItem('speed_unit',ev.target.value);
      this.updateSpeedUnit(ev.target.value)
  }
  changeSpeedNotification(ev) {
    const params = {
      noti: Number(ev.target.value),
      value: 'Overspeed'
    }
    this.api.post('updateNotification',params,true).subscribe(res => {
      // this.api.presentToast(res.msg);
    })
  }
  changeEventNotification(ev) {
    const params = {
      noti: JSON.stringify(ev.target.value),
      value: 'Events'
    }
    this.api.post('updateNotification',params,true).subscribe(res => {
      // this.api.presentToast(res.msg);
    })
  }
  updateSpeedUnit(value) {
    let params;
    if(value == 'mph') {
      params = {
        speed_unit: 1
      }
    } else {
      params = {
        speed_unit: 0
      }
    }
    this.api.post('updateSpeedUnit',params,true).subscribe(res => {
      // this.api.presentToast(res.msg);
    })
  } 

}
