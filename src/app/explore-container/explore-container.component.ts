import { Component, OnInit, Input } from '@angular/core';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-explore-container',
  templateUrl: './explore-container.component.html',
  styleUrls: ['./explore-container.component.scss'],
})
export class ExploreContainerComponent implements OnInit {
  @Input() name: string = '';
  dark = this.api.dark;

  constructor(
    public api: HttpService
  ) {
    
  }
  ionViewWillEnter() {
    if(localStorage.getItem('dark') == 'false') {
      this.dark = false;
    } else {
      this.dark = true;
    }
    console.log(this.dark)
  }
  ngOnInit() {
  }
  toggleTheme(ev) {
    if(ev.detail.checked) {
      this.api.dark = true;
      document.body.setAttribute('color-theme','dark');
      document.body.style.backgroundColor = '#1e1e1e'
    } else {
      this.api.dark = false;
      document.body.style.backgroundColor = 'white'
      document.body.setAttribute('color-theme','light');
    }
  }
}
