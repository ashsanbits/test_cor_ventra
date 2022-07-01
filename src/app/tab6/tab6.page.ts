import { Component, OnInit } from '@angular/core';
import { HttpService } from '../services/http.service';
import {File} from "@awesome-cordova-plugins/file/ngx";
import * as moment from 'moment';
import { ModalController, Platform } from '@ionic/angular';
import { RemoteplaybackPage } from '../modals/remoteplayback/remoteplayback.page';
import { Router } from '@angular/router';
import { IonicSelectableComponent } from 'ionic-selectable';

@Component({
  selector: 'app-tab6',
  templateUrl: './tab6.page.html',
  styleUrls: ['./tab6.page.scss'],
  providers: [File]
})
export class Tab6Page implements OnInit {
  devicesList: any;
  deviceid: any = '';
  devices: any;
  searchDevices: any[];

  constructor(
    private api: HttpService,
    private file: File,
    private router: Router,
    private modal: ModalController,
    private platform: Platform
  ) { }

  ngOnInit() {
    this.initialize();
  }
  ionViewWillEnter() {
    this.initialize();
  }
  initialize() {
    this.deviceid = ''
    this.devices = null;
    this.devicesList = null;
    this.searchDevices = []
    this.devices = JSON.parse(localStorage.getItem('online'));
    this.devices.forEach(element => {
      this.searchDevices.push({
        id: element.deviceid,
        name: element.deviceid + '-' + element.drivername + '-' + element.vehicleid
      })
    });
  }
  portChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    this.remoteplayback(event.value.id)
      this.deviceid = event.value.id
  }
  remoteplayback(deviceid) {
    this.deviceid = deviceid;
    this.devicesList = null;
    const body = 'username='+localStorage.getItem('ventra_user')+'&password='+localStorage.getItem('ventra_pass')+'&deviceid='+deviceid;
    this.api.ventra_post('api/recordlist', body,true).subscribe((data) => {
      this.devicesList = data.reverse();
    });
  }
  converttime(s, e) {
    return moment.unix(s).format('yyyy-MM-DD HH:mm:ss') + ' ------- ' + moment.unix(e).format('yyyy-MM-DD HH:mm:ss');
  }
  diferencetime(s, e) {
    const start = moment.unix(s).format('yyyy-MM-DD HH:mm:ss');
    const end = moment.unix(e).format('yyyy-MM-DD HH:mm:ss');
    let diff = String(moment(end).diff(moment(start)));
    return diff.substring(0, diff.length - 3) + 's';
  }
  async presentModal(data) {
    const start = moment.unix(data.start).format('yyyy-MM-DD HH:mm:ss');
    const end = moment.unix(data.end).format('yyyy-MM-DD HH:mm:ss');
    const diff = String(moment(end).diff(moment(start)));
    let sec = diff.substring(0, diff.length - 3);
    this.router.navigate(['remoteplayback'],{queryParams: {
      start: data.start,
      end: data.end,
      startdt: start,
      enddt: end,
      time: sec,
      deviceid: this.deviceid
    }});

    // const modal = await this.modal.create({
    //   component: RemoteplaybackPage,
    //   cssClass: 'my-custom-class',
    //   componentProps:{
    //     start: start,
    //     end: end,
    //     time: sec
    //   }
    // });
    // return await modal.present();
  }
}
