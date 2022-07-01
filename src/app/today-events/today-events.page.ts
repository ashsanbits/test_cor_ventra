import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { HttpService } from '../services/http.service';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { FileTransfer, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import { ModalController, Platform } from '@ionic/angular';
import { ImageviewPage } from '../models/imageview/imageview.page';
import { StreamingMedia } from '@awesome-cordova-plugins/streaming-media/ngx';

@Component({
  selector: 'app-today-events',
  templateUrl: './today-events.page.html',
  styleUrls: ['./today-events.page.scss'],
})
export class TodayEventsPage implements OnInit {
  events: any;
  afterDate = new Date();
  username = localStorage.getItem('ventra_user');
  password = localStorage.getItem('ventra_pass');
  driver_devices: any = JSON.parse(localStorage.getItem('driver_devices'));
  user = localStorage.getItem('user_type');
  imgUrl: any;
  url: any;
  constructor(
    public api: HttpService,
    private file: File,
    private modalCtrl: ModalController,
    private transfer: FileTransfer,
    private platform: Platform,
    private streamingMedia: StreamingMedia,
  ) { }

  ngOnInit() {
    if(this.user == 'admin') {
      this.getData()
    } else {
      this.getDevicesData()
    }
  }
  getData() {
    this.events = null;
    let date = moment(this.afterDate).format('yyyy-MM-DD');
    const body = 'username=' + this.username + '&password=' + this.password + '&afterTime=' + date+'T00:00:00-0400';
    this.api.ventra_post('gkevent/eventquery',body,true).subscribe(res => {
      this.events = res.reverse();
    })
  }
  getDevicesData() {
    let date = moment(this.afterDate).format('yyyy-MM-DD');
    this.events = null;
    let arr = [];
    let params = null;
    this.driver_devices.forEach((element, key) => {
      params = null;
      params = 'username=' + this.username + '&password=' + this.password + '&afterTime=' + date+'T00:00:00-0400' + '&deviceid=' + element.deviceid;
      this.api.ventra_post('gkevent/eventquery',params,true).subscribe(res => {
        res.forEach(element => {
          arr.push(element);
        });
        if(key == this.driver_devices.length - 1) {
          this.events = arr.reverse();
        }
    })
  })
}
publicEvent(type) {
  let value = '';
  if(type == '8') {
    value = 'GPIO0';
  } else if(type == '9') {
    value = 'GPIO1';
  } else if(type == '10') {
    value = 'GPIO2';
  } else if(type == '11') {
    value = 'GPIO3';
  } else if(type == '12') {
    value = 'DiskError';
  } else if(type == '13') {
    value = 'OverSpeed';
  } else if(type == '15') {
    value = 'VideoLoss';
  } else if(type == '16') {
    value = 'Gsensor';
  } else if(type == '21') {
    value = 'GPIO4';
  } else if(type == '22') {
    value = 'GPIO5';
  } else if(type == '23') {
    value = 'GPIO6';
  } else if(type == '24') {
    value = 'GPIO7';
  } else if(type == '25') {
    value = 'GPIO8';
  } else if(type == '26') {
    value = 'GPIO9';
  } else if(type == '31') {
    value = 'ACC_ON';
  } else if(type == '32') {
    value = 'ACC_OFF';
  } else if(type == '33') {
    value = 'Gsensor false positive';
  } else if(type == '51') {
    value = 'TriggerIn';
  } else if(type == '52') {
    value = 'TriggerOut	';
  } else if(type == '60') {
    value = 'RADR0';
  } else if(type == '61') {
    value = 'RADR1';
  } else if(type == '62') {
    value = 'RADR2';
  } else if(type == '63') {
    value = 'RADR2';
  } else if(type == '64') {
    value = 'RADR2';
  } else if(type == '65') {
    value = 'RADR5';
  } else if(type == '66') {
    value = 'RADR6';
  } else if(type == '67') {
    value = 'RADR7';
  } else if(type == '68') {
    value = 'RADR8';
  } else if(type == '69') {
    value = 'RADR9';
  } else if(type == '90') {
    value = 'SD backup(0)';
  } else if(type == '91') {
    value = 'SD backup(1)';
  } else if(type == '92') {
    value = 'SD backup(2)';
  } else if(type == '98') {
    value = 'liveview record lost backup';
  } else if(type == '99') {
    value = 'Interval backup';
  } else if(type == '201') {
    value = 'Loopdata';
  } else if(type == '202') {
    value = 'FRID';
  } else if(type == '204') {
    value = 'RFID';
  } else if(type == '205') {
    value = 'BRCD';
  } else if(type == '206') {
    value = 'EISP';
  } else if(type == '207') {
    value = 'EDSP';
  } else if(type == '208') {
    value = 'TURN';
  } else if(type == '209') {
    value = 'TEMP';
  }
  return value;
}
async eventImage(ev) {
  const url = 'http://www.ventracloud.com:8900/pic.cgi?type=snap&t='+ev.eventtimeutc+'&deviceid='+ev.deviceid+'&ch=1&user='+this.username+'&password='+this.password;
  const url1 = 'http://www.ventracloud.com:8900/pic.cgi?type=snap&t='+ev.eventtimeutc+'&deviceid='+ev.deviceid+'&ch=2&user='+this.username+'&password='+this.password;
  const modal = await this.modalCtrl.create({
    component: ImageviewPage,
    cssClass: 'my-custom-class',
    componentProps: { 
      url: url,
      url1: url1
     }
  });
  modal.onDidDismiss().then(data => {
  });
  return await modal.present();
}
download(ch, ev) {
 this.api.showLoader();
let url = 'https://www.ventracloud.com/gkevent/footage/test.mp4?u='+this.username+'&p='+this.password+'&s='+ev.serialno+'&c='+ch;
let filepath;
  if(this.platform.is('android')) {
    filepath = this.file.externalDataDirectory ;
  } else {
    filepath = this.file.syncedDataDirectory;
  }
this.downloadFile(filepath,url, ch, ev.deviceid);
}
downloadFile(path, u, channel,device) {
const fileTransfer: FileTransferObject  = this.transfer.create();
const url = encodeURI(u);
let filename = null;
let numberrr = Math.floor(Math.random() * (999999 - 1111 + 1) + 1111)
filename = path  +'event_downloads/' + device + '-ch' + channel + '-' + numberrr + '.mp4';
fileTransfer.download(url, filename).then((entry) => {
  this.api.hideLoader();
  this.api.presentToast('Video Saved Successfully !!');
  this.streamingMedia.playVideo(filename);
});
}

}
