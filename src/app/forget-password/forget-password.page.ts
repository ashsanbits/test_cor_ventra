import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.page.html',
  styleUrls: ['./forget-password.page.scss'],
})
export class ForgetPasswordPage implements OnInit {
  forgetForm: FormGroup;

  constructor(
    private api: HttpService,
    private location: Location
  ) { }

  ngOnInit() {
    this.forgetForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }
  goBack() {
    this.location.back();
  }
  onSubmit() {
    this.api.post('forgotPassword',this.forgetForm.value,true).subscribe((res: any) => {
      if(res.Error) {
        this.api.presentToast(res.msg);
      } else {
        this.forgetForm.reset();
        this.location.back();
        this.api.presentToast(res.msg);
      }
    })
  }

}
