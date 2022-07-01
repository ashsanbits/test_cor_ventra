import { Component, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';

import { File } from '@awesome-cordova-plugins/file/ngx';
import { FileTransfer, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { StreamingMedia } from '@awesome-cordova-plugins/streaming-media/ngx';

@Component({
  selector: 'app-remoteplayback',
  templateUrl: './remoteplayback.page.html',
  styleUrls: ['./remoteplayback.page.scss'],
})
export class RemoteplaybackPage implements OnInit {
  ngMinutes = '1';
  ngChannel = '1';
  starttime: any;
  startdate: any;
  enddate: any;
  endtime: any;
  time: any;
  params: any;

  unix_start_time: any;
  unix_start: any;
  unix_end: any;
  download_url: any;
  timeout: any;
  timeout_count = 1;
  counter = 0;
  constructor(
    private activeRoute: ActivatedRoute,
    private api: HttpService,
    private file: File,
    public permission: AndroidPermissions,
    private transfer: FileTransfer,
    private platform: Platform,
    private streamingMedia: StreamingMedia,
  ) { }

  ngOnInit() {
    this.activeRoute.queryParams.subscribe(params => {
      this.params = params;
      this.time = Math.floor(Number(params.time)/60);
      let startdate = params.startdt.split(' ');
      let enddate = params.enddt.split(' ');
      this.startdate = startdate[0];
      this.starttime = startdate[1];
      this.enddate = enddate[0];
      this.endtime = enddate[1];
      this.unix_start = params.start;
      this.unix_start_time = params.start;
      this.unix_end = params.end;
    })
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
  changeRange(ev) {
    // let t =  moment(this.params.start).add(ev.detail.value, 'minutes').format('yyyy-MM-D HH:mm:ss');
    // let tt = String(t).split(' ');
    // this.starttime = tt[1];
    let t =  Number(this.unix_start) + (Number(ev.detail.value) * 60);
    this.unix_start_time = t;
  }
  // download() {
  //   let t = String(this.params.start).split(' ');
  //   let date = t[0]+'T'+this.starttime+'+0800';
  //   let url = 'https://www.ventracloud.com/dlremote/'+this.params.deviceid+'@'+this.ngChannel+'/'+this.ngMinutes+'/'+date+'/'+localStorage.getItem('ventra_user')+'/'+localStorage.getItem('ventra_pass')+'/'+this.params.deviceid+'.mp4';
  //   window.open(url, '_blank', 'location=no,closebuttoncaption=Cerrar,toolbar=yes,enableViewportScale=yes');
  // }
  askForVideo() {
    if(this.timeout_count = 1) {
      this.counter ++;
      this.download_url = 'https://www.ventracloud.com/web.cgi?type=repbmp4get&deviceid='+this.params.deviceid+'&user='+localStorage.getItem('ventra_user')+'&password='+localStorage.getItem('ventra_pass')+'&duration='+Number(this.ngMinutes) * 60+'&ch='+this.ngChannel+'&spbtime='+this.unix_start_time+'&main=1';
    this.api.ventra_Video_post('https://www.ventracloud.com/web.cgi?type=repbmp4ask&deviceid='+this.params.deviceid+'&user='+localStorage.getItem('ventra_user')+'&password='+localStorage.getItem('ventra_pass')+'&duration='+Number(this.ngMinutes) * 60+'&ch='+this.ngChannel+'&spbtime='+this.unix_start_time+'&main=1',true).subscribe(res => {
      this.api.hideLoader();
      if(res.result == 'CREATE OK') {
        this.api.showLoadermsg('OK');
        this.askForVideo();
      } else if(res.result == 'HANDLING') {
        this.api.showLoadermsg('Processing Request');
        this.timeout = setTimeout(() => {
          if(this.counter == 3) {
            this.api.presentToast('File may be large please wait while downloading');
          }
          this.askForVideo();
        }, 10000);
      } else if(res.result == 'DOWNLOAD OK') {
        this.api.showLoadermsg('Downloading');
        this.download();
      } else {
        this.api.presentToast('Download Fail Try again');
      }
    })
    }
    
  }
  download() {
    let filepath;
    if(this.platform.is('android')) {
      filepath = this.file.externalDataDirectory ;
    } else {
      filepath = this.file.syncedDataDirectory;
    }
  //  let filepath = this.file.externalDataDirectory ;
   this.downloadFile(filepath,this.download_url, this.ngChannel, this.params.deviceid);
   }
   downloadFile(path, u, channel,device) {
   const fileTransfer: FileTransferObject  = this.transfer.create();
   const url = encodeURI(u);
   let filename = null;
   let numberrr = Math.floor(Math.random() * (999999 - 1111 + 1) + 1111)
   filename = path  +'remote_downloads/' + device + '-ch' + channel + '-' + numberrr + '.mp4';
   fileTransfer.download(url, filename).then((entry) => {
      console.log(entry)
     this.api.hideLoader();
     this.api.presentToast('Video Saved Successfully !!');
     this.streamingMedia.playVideo(filename);
   });
   }
   ionViewWillLeave() {
    this.timeout_count = 0;
    window.clearTimeout(this.timeout);
   }

}
