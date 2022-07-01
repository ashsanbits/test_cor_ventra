import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from './services/http.service';
import { MenuService } from './services/menu.service';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { UtilServiceService } from './services/util-service.service';
import { Platform } from '@ionic/angular';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { FCM } from "cordova-plugin-fcm-with-dependecy-updated/ionic";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  name = localStorage.getItem('name');
  user = localStorage.getItem('user_type');

  public appPages;
  disconnectSubscription: any;
  connectSubscription: any;
  networkAlert: any;
  constructor(
    private route: Router,
    private api: HttpService,
    public menu: MenuService,
    private network: Network,
    private util: UtilServiceService,
    private screenOrientation: ScreenOrientation,
    private platform: Platform
  ) {
    localStorage.setItem('dark','false');
    this.menu.setMenu();
    // if(localStorage.getItem('Ventra_App_AUTH_TOKEN')) {
    //   this.api.get('tokenCheck',null,false).subscribe(res => {
    //     console.log(res);
    //     if(res.error) {
    //       localStorage.clear();
    //       this.api.presentToast('Auth token expired');
    //       this.route.navigateByUrl('')
    //     }
    //   })
    // }
    this.checkInternetConnection();
  }
  async ngOnInit() {
    this.platform.ready().then(res => {
      if(this.platform.is('android') || this.platform.is('ios')) {
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
      }
      // this.checkLoginStatus();
      console.log('platform ready')
      FCM.requestPushPermission().then(res => {
        console.log('res' + res)
      }).catch(err => {
        console.log('err' + err)
      })
    })
  }
  checkLoginStatus() {
    if (localStorage.getItem("Ventra_App_AUTH_TOKEN")) {
      this.route.navigate(["/tabs/tab1"], { replaceUrl: true });
    } else {
      this.route.navigate(["/login"], { replaceUrl: true });
    }
  }
  logout() {
    this.api.post('logout', null, true).subscribe(res => {
      localStorage.clear();
      this.route.navigate(['login'], { replaceUrl: true });
    })
  }
  checkInternetConnection() {
    this.disconnectSubscription = this.network.onDisconnect().subscribe(async () => {
      console.log('network was disconnected :-(');
      this.networkAlert = await this.util.createAlert('No Internet', false, 'Please Check your internet Connection and try again', {
        text: '',
        role: '',
        cssClass: 'secondary',
        handler: async () => { }
      });
      this.networkAlert.present();
    });
    this.connectSubscription = this.network.onConnect().subscribe(() => {
      console.log('network connected!');
      if (this.networkAlert) {
        this.networkAlert.dismiss();
      }
    });
  }
}
