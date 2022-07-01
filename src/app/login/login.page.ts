import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../services/http.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { MenuController, Platform } from '@ionic/angular';
import { MenuService } from '../services/menu.service';
import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  constructor(
    private _api: HttpService,
    private router: Router,
    private menu: MenuController,
    private menuService: MenuService,
    private platform: Platform,

  ) { }

  ngOnInit() {
    if(this.platform.is('cordova')) {
      this.getToken();
    }
    this.menu.enable(false)
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      fcmToken: new FormControl('',[]),
    });
  }
  getToken() {
    FCM.getToken().then(token => {
      console.log(token);
      this.loginForm.patchValue({
        fcmToken: token
      })
    });
  }
  onSubmit() {
    this._api.post('login', this.loginForm.value, true).subscribe((resp) => {
      if (resp.error == false) {
        localStorage.setItem('name', resp.user.name);
        localStorage.setItem('email', resp.user.email);
        localStorage.setItem('user_type',resp.user.user_type)
        localStorage.setItem('check_password',resp.user.remember_token)
        localStorage.setItem('Ventra_App_AUTH_TOKEN', resp.token);
        if(resp.user.user_type == 'admin') {
          localStorage.setItem('ventra_user',resp.user.user_ventra);
          localStorage.setItem('ventra_pass',resp.user.ventra_password_hash);
        } else {
          localStorage.setItem('driver_devices',JSON.stringify(resp.devices))
          localStorage.setItem('ventra_user',resp.user.user_ventra);
          localStorage.setItem('ventra_pass',resp.user.ventra_password_hash);
        }
        this.menuService.setMenu();
        this.router.navigate(['/tabs/tab1'], {replaceUrl: true});
      } else {
        this._api.presentToast(resp.msg);
      }
    });
  }
  async forgotPassword() {
    this.router.navigateByUrl('/forget-password')
  }

}
