import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { HttpService } from 'src/app/services/http.service';
import swal from 'sweetalert2';


@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.page.html',
  styleUrls: ['./update-password.page.scss'],
})
export class UpdatePasswordPage implements OnInit {

  profileForm: FormGroup;

  constructor(
    private modalCtrl: ModalController,
    private _api: HttpService,
  ) { }

  ngOnInit() {
    this.profileForm = new FormGroup({
      password: new FormControl('', [Validators.required]),
      new_password: new FormControl('', [Validators.required]),
      confirm_password: new FormControl('', [Validators.required]),
      tempemail: new FormControl(localStorage.getItem('email'), [Validators.required, Validators.email]),
    });
  }
  closeModal() {
    this.modalCtrl.dismiss();
  }
  updateProfile() {
    if (this.profileForm.get('new_password').value == this.profileForm.get('confirm_password').value) {
      swal({
        title: 'Are you sure?',
        text: "You want to update your Password!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#0CC27E',
        cancelButtonColor: '#FF586B',
        confirmButtonText: 'Yes, Update!',
        cancelButtonText: 'No, cancel!',
        confirmButtonClass: 'btn btn-success btn-raised mr-5',
        cancelButtonClass: 'btn btn-danger btn-raised',
        buttonsStyling: false,
        allowOutsideClick: false
      }).then(data => {
        if (data.value) {
          this._api.post('updatePassword', this.profileForm.value, true).subscribe(res => {
            if (!res.error) {
              this.profileForm.reset()
              this._api.presentToast('Password Updated Sucessfully')
              this.closeModal();
            } else {
              this._api.presentToast(res.msg)
            }
          })
        }
      })
    } else {
      this._api.presentToast('Passwords are not matched');
    }

  }

}
