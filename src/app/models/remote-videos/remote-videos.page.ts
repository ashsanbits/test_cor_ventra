import { Component, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { File, FileEntry } from '@awesome-cordova-plugins/file/ngx';
import { StreamingMedia } from '@awesome-cordova-plugins/streaming-media/ngx';

@Component({
  selector: 'app-remote-videos',
  templateUrl: './remote-videos.page.html',
  styleUrls: ['./remote-videos.page.scss'],
})
export class RemoteVideosPage implements OnInit {

  files: any = [];

  constructor(
    private modal: ModalController,
    private file: File,
    private streamingMedia: StreamingMedia,
    private platform: Platform
  ) { }

  ngOnInit() {
    this.loadFiles();
  }
  closeModal() {
    this.modal.dismiss();
  }
  loadFiles() {
    let filepath;
    if(this.platform.is('android')) {
      filepath = this.file.externalDataDirectory ;
    } else {
      filepath = this.file.syncedDataDirectory;
    }
    this.file.listDir(filepath, 'remote_downloads').then(
      res => {
        console.log(filepath)
        console.log(res[0].nativeURL);
        this.files = res;

      },
      err => console.log('error loading files: ', err)
    );
  }
  openFile(f: FileEntry) {
    if (f.name.indexOf('.MOV') > -1 || f.name.indexOf('.mp4') > -1) {
      // E.g: Use the Streaming Media plugin to play a video
      this.streamingMedia.playVideo(f.nativeURL);
    }
  }
  playVideo() {
    this.streamingMedia.playVideo('rtsp://fuho888.cctvdvr.com.tw:8900/video.sdp?deviceid=3f7ee682b70b9520&user=admin&password=8C6976E5B5410415BDE908BD4DEE15DFB167A9C873FC4BB8A81F6F2AB448A918&type=live&channel=1')
  }
  deleteFile(f: FileEntry) {
    const path = f.nativeURL.substr(0, f.nativeURL.lastIndexOf('/') + 1);
    this.file.removeFile(path, f.name).then(() => {
      this.loadFiles();
    }, err => console.log('error remove: ', err));
  }
}
