import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  public appPages;
  constructor() { }
  setMenu() {
    this.appPages = [];
    this.appPages = [
      { title: 'Dashboard', url: '/tabs/tab1', icon: 'home' },
      { title: 'List View', url: '/tabs/tab2', icon: 'list' },
      { title: 'GPS Playback', url: '/tabs/tab3', icon: 'location' },
      { title: 'Downloads', url: 'videos', icon: 'cloud-download' },
      { title: 'Today Events', url: '/today-events', icon: 'clipboard' },
      { title: 'Settings', url: '/tabs/tab4', icon: 'Settings' },
      { title: 'Contact Support', url: '/contact-support', icon: 'information' }
    ];
    // if (localStorage.getItem('user_type') == 'admin') {
    //   this.appPages.push(
    //   )
    // } else {
  
    // }
    // this.appPages.push(
      
    // )
  }
}
