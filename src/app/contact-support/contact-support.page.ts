import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-contact-support',
  templateUrl: './contact-support.page.html',
  styleUrls: ['./contact-support.page.scss'],
})
export class ContactSupportPage implements OnInit {
  contactForm: FormGroup;

  constructor(
    private api: HttpService
  ) { }

  ngOnInit() {
    this.contactForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      name: new FormControl('', [Validators.required]),
      subject: new FormControl('', [Validators.required]),
      message: new FormControl('', [Validators.required])
    });
  }
  onSubmit() {
    this.api.post('contactSupport',this.contactForm.value,true).subscribe((res: any) => {
      if(res.error) {
        this.api.presentToast(res.msg);
      } else {
        this.contactForm.reset();
        this.api.presentToast(res.msg);
      }
    })
  }

}
