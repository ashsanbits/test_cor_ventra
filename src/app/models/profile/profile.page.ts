import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  profileForm: FormGroup;

  constructor(
    private modalCtrl: ModalController,
    private _api: HttpService,
  ) { }

  ngOnInit() {
    this.profileForm = new FormGroup({
      name: new FormControl(localStorage.getItem('name'), [Validators.required]),
      user_type: new FormControl(localStorage.getItem('user_type'), [Validators.required]),
      email: new FormControl(localStorage.getItem('email'), [Validators.required, Validators.email]),
      tempemail: new FormControl(localStorage.getItem('email'), [Validators.required, Validators.email]),
    });
  }
  closeModal() {
    this.modalCtrl.dismiss();
  }
  updateProfile() {
    this._api.post('updateProfile',this.profileForm.value,true).subscribe(res => {
      if(!res.error) {
        localStorage.setItem('email',this.profileForm.get('email').value)
        this._api.presentToast('Profile Updated Sucessfully')
        this.closeModal();
      }
    })
  }

}
