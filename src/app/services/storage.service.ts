import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private toastr: ToastrService 
  ) { }

  setLocalStorage(key,value) {
    localStorage.setItem(key, value);
  }
  getLocalStorage(key) {
    return localStorage.getItem(key);
  }
  showToast(key,msg) {
    if(key == 'success') {
      this.toastr.success(msg)
    } else if(key == 'warning') {
      this.toastr.warning(msg)
    } else {
      this.toastr.error(msg)
    }
  }
}
