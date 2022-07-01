import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  handleData(token){
    localStorage.setItem('Ventra_App_AUTH_TOKEN', token);
  }

  getToken(){
    return localStorage.getItem('Ventra_App_AUTH_TOKEN');
  }

  // User state based on valid token
  isLoggedIn() {
    if (this.getToken()) {
      return true;
    } else {
      return false;
    }
  }

  // Remove token
  removeToken(){
    localStorage.removeItem('Ventra_App_AUTH_TOKEN');
  }
}