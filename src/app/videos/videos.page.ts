import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EventVideosPage } from '../models/event-videos/event-videos.page';
import { RemoteVideosPage } from '../models/remote-videos/remote-videos.page';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.page.html',
  styleUrls: ['./videos.page.scss'],
})
export class VideosPage implements OnInit {

  constructor(
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
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
  async remoteVideos() {
    const modal = await this.modalCtrl.create({
      component: RemoteVideosPage,
      cssClass: 'my-custom-class',
      componentProps: {}
    });
    modal.onDidDismiss().then(data => {
    });
    return await modal.present();
  } 

}
