import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../services/http.service';
import * as moment from 'moment';
import { IonicSelectableComponent } from 'ionic-selectable';
import { ModalController, Platform } from '@ionic/angular';
import { ImageviewPage } from '../models/imageview/imageview.page';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { FileTransfer, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { EventVideosPage } from '../models/event-videos/event-videos.page';
import { NotificationService } from '../services/notification.service';
import { StreamingMedia } from '@awesome-cordova-plugins/streaming-media/ngx';

@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
})
export class Tab5Page implements OnInit {
  @ViewChild('content') private content: any;

  options = {
    weekdays: ['Su','Mo','Tue','Wed','Thu','Fri','Sat'],
    to: new Date(),
    from: new Date('01-01-2010'),
  }
  type: 'string'; 
  devices: any;
  searchDevices = [];
  events: any;
  eventForm: FormGroup;
  newSearch = false;
  date = moment(new Date()).format('yyyy-MM-DD');
  maxdate = moment(new Date()).format('yyyy-MM-DD');
  selectedevice: any;
  iosPlatform: any;
  constructor(
    private api: HttpService,
    private modalCtrl: ModalController,
    private http: HTTP,
    private file: File,
    private transfer: FileTransfer,
    public permission: AndroidPermissions,
    public notificationService: NotificationService,
    private platform: Platform,
    private streamingMedia: StreamingMedia
  ) { }
  ngOnInit() {
    this.date = moment(new Date()).format('yyyy-MM-DD');
    this.eventForm = new FormGroup({
      date: new FormControl(this.date, Validators.required),
      desc: new FormControl(true),
      deviceid: new FormControl('', Validators.required),
      password: new FormControl(localStorage.getItem('ventra_pass')),
      username: new FormControl(localStorage.getItem('ventra_user'))
    })
    this.initialize();
  }
  scroll(id) {
    let el = document.getElementById(id);
    el.scrollIntoView();
  }
  initialize() {
    this.events = null;
    this.searchDevices = []
    this.newSearch = false;
    this.devices = null;
    this.devices = JSON.parse(localStorage.getItem('devices'));
    this.devices.forEach(element => {
      this.searchDevices.push({
        id: element.deviceid,
        name: element.deviceid + '-' + element.drivername + '-' + element.vehicleid
      })
    });
    if(this.platform.is('android')) {
      this.permission.checkPermission(this.permission.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
        async (result: any) => {
          console.log(result);
          if (result.hasPermission) {
  
          } else {
              this.permission.requestPermission(this.permission.PERMISSION.WRITE_EXTERNAL_STORAGE);
            }
          },
          err => this.permission.requestPermission(this.permission.PERMISSION.WRITE_EXTERNAL_STORAGE)
        );
    }
  }
  ionViewWillEnter() {
    this.initialize();
  }
  searchEvents() {
    const body = 'username=' + this.eventForm.get('username').value + '&password=' + this.eventForm.get('password').value + '&deviceid=' + this.eventForm.get('deviceid').value + '&desc=' + this.eventForm.get('desc').value  + '&date=' + this.date;
    this.api.ventra_post('gkevent/eventquery',body,true).subscribe(res => {
      if(res.length >0) {
        this.newSearch = true;
      } else {
        this.api.presentToast('No events found');
      }
      this.events = res.reverse();
    })
  }
  dateSelection(ev) {
    this.date = ev.target.value;
    this.eventForm.patchValue({
      date: ev.target.value
    })
  }
  portChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    this.eventForm.patchValue({
      deviceid: event.value.id
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
    const url = 'http://www.ventracloud.com:8900/pic.cgi?type=snap&t='+ev.eventtimeutc+'&deviceid='+this.eventForm.get('deviceid').value+'&ch=1&user='+this.eventForm.get('username').value+'&password='+this.eventForm.get('password').value;
    const url1 = 'http://www.ventracloud.com:8900/pic.cgi?type=snap&t='+ev.eventtimeutc+'&deviceid='+this.eventForm.get('deviceid').value+'&ch=2&user='+this.eventForm.get('username').value+'&password='+this.eventForm.get('password').value;
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
  downloadEvent(ev) {
    const params = {
      "username": "BBits",
    "password": "8D6000887BC654D34A8761A922AD540F92D290DAC38362E52F85EB86410D4B74",
    "serialno": "206911",
    "ch": 1
    }
    this.api.ventra_download('gkevent/eventclipdownload',params,false).subscribe(res => {
      console.log(res)
    })
  }
  downloadFileAndStore() {
    console.log('here');
    //
    const filePath = this.file.externalDataDirectory + 'fileName.mp4'; 
                     // for iOS use this.file.documentsDirectory
    console.log(filePath)
    this.http.downloadFile('https://www.ventracloud.com/gkevent/footage/test.mp4?u=BBits&p=8D6000887BC654D34A8761A922AD540F92D290DAC38362E52F85EB86410D4B74&s=206911&c=1', {}, {}, filePath).then(response => {
       // prints 200
       console.log('success block ...', response);
    }).catch(err => {
        // prints 403
        console.log('error block ... ', err.status);
        // prints Permission denied
        console.log('error block ... ', err.error);
    })
  }
 download(ch, ev) {
   this.api.showLoader();
  let url = 'https://www.ventracloud.com/gkevent/footage/test.mp4?u='+this.eventForm.get('username').value+'&p='+this.eventForm.get('password').value+'&s='+ev.serialno+'&c='+ch;
  console.log(url);
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

  // fileTransfer.onProgress((progressEvent) => {
  //   var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
  //   this.notificationService.updateNotificationProgress(1,perc,"downloaded "+ perc + " %");
  //   console.log(" Downloaded File progress = "+ perc + " %");
  //   if(perc==100)
  //   {
  //       //remove notification after download completed
  //       this.notificationService.cancelNotification(1);
  //   }
  //   });
  
    // this.notificationService.sendNotification(1,"downloading "+ filename, "Event Video", 0);
  fileTransfer.download(url, filename).then((entry) => {
    console.log(entry)
    this.api.hideLoader();
    this.api.presentToast('Video is downloaded successfully')
    this.streamingMedia.playVideo(filename);
    // this.loadFiles();
  });
}
loadFiles() {
  this.file.listDir(this.file.externalDataDirectory, 'event_downloads').then(
    res => {
      console.log(res);
    },
    err => console.log('error loading files: ', err)
  );
}
  async eventVideos() {
    const modal = await this.modalCtrl.create({
      component: EventVideosPage,
      cssClass: 'my-custom-class',
      componentProps: {}
    });
    modal.onDidDismiss().then(data => {
    });
    return await modal.present();
  } 
}
