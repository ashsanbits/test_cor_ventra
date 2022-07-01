import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-imageview',
  templateUrl: './imageview.page.html',
  styleUrls: ['./imageview.page.scss'],
})
export class ImageviewPage implements OnInit {
  url: any;
  url1: any;
  constructor(
    private modal: ModalController,
    private navParams: NavParams
  ) { }

  ngOnInit() {
    this.url = this.navParams.get('url');
    this.url1 = this.navParams.get('url1');
  }
  closeModal() {
    this.modal.dismiss();
  }

}
