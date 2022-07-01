import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, finalize, map, retry, timeout } from 'rxjs/operators';
import { Observable, throwError, fromEvent, merge, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';

import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { SpinnerDialog } from '@awesome-cordova-plugins/spinner-dialog/ngx';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  baseUrl: any = environment.apiUrl;
  public imgUrl = environment.imgUrl;
  dark: any = false;
  constructor(
    private http: HttpClient,
    public toastCtrl: ToastController,
    private alertController: AlertController,
    public loadingCtrl: LoadingController,
    private router: Router,
    public spinner: SpinnerDialog
  ) { }

  public get(url, params = null, loading): Observable<any> {
    if (loading) {
      // this.showLoader();
      this.spinner.show();
    }
    if (params) {
      return this.http
        .get(this.baseUrl + url, {
          params
        })
        .pipe(
          timeout(60000),
          // retry(3),
          map(this.handleResponse),
          finalize(() => {
            // this.hideLoader();
            this.spinner.hide();
          }),
          catchError(this.handleError)
        );
    }
    return this.http.get(this.baseUrl + url).pipe(
      timeout(60000),
      // retry(3),
      map(this.handleResponse),
      finalize(() => {
        // this.hideLoader();
        this.spinner.hide();
      }),
      catchError(this.handleError)
    );
  }

  public post(url, params, loading): Observable<any> {
    if (loading) {
      // this.showLoader();
      this.spinner.show();
    }
    return this.http.post(this.baseUrl + url, params).pipe(
      timeout(60000),
      retry(3),
      map(this.handleResponse),
      finalize(() => {
        // this.hideLoader();
        this.spinner.hide();
      }),
      catchError(this.handleError)
    );

  }

  public handleResponse(data) {
    return data;
  }

  public handleError(error) {
    return throwError(error);
  }
  showToast(msg) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'bottom',
      showConfirmButton: false,
      timer: 2000,
    })
    
    Toast.fire({
      title: msg
    })
  }
  toastMessage() {
    const Toast = Swal.mixin({
      toast: true,
      customClass: {
        popup: 'colored-toast'
      },
      position: 'center',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    
    Toast.fire({
      icon: 'success',
      title: 'Signed in successfully'
    })
  }
  // deleteAllert(url) {
  //   let promise = new Promise((resolve, reject) => {
  //     swal({
  //       title: 'Are you sure?',
  //       text: "You won't be able to revert this!",
  //       type: 'warning',
  //       showCancelButton: true,
  //       confirmButtonColor: '#0CC27E',
  //       cancelButtonColor: '#FF586B',
  //       confirmButtonText: 'Yes, delete it!',
  //       cancelButtonText: 'No, cancel!',
  //       confirmButtonClass: 'btn btn-success btn-raised mr-5',
  //       cancelButtonClass: 'btn btn-danger btn-raised',
  //       buttonsStyling: false,
  //       allowOutsideClick: false
  //     }).then(data => {
  //       if (data.value) {
  //         this.get(url, {}, false).subscribe((res) => {
  //           swal(
  //             'Deleted!',
  //             'Your record has been deleted.',
  //             'success'
  //           )
  //           resolve(res)
  //         }, (error) => {
  //         })

  //       }
  //     })
  //   });
  //   return promise;
  // }
  // logout() {
  //   let promise = new Promise((resolve, reject) => {
  //     swal({
  //       title: 'Are you sure?',
  //       text: "You want to end your session!",
  //       type: 'warning',
  //       showCancelButton: true,
  //       confirmButtonColor: '#0CC27E',
  //       cancelButtonColor: '#FF586B',
  //       confirmButtonText: 'Yes, Logout!',
  //       cancelButtonText: 'No, cancel!',
  //       confirmButtonClass: 'btn btn-success btn-raised mr-5',
  //       cancelButtonClass: 'btn btn-danger btn-raised',
  //       buttonsStyling: false,
  //       allowOutsideClick: false
  //     }).then(data => {
  //       if (data.value) {
  //         this.get('logout', null, true).subscribe(res => {
  //           this.router.navigateByUrl('/auth/sigin')
  //           localStorage.clear();
  //         });
  //       }
  //     })
  //   });
  //   return promise;
  // }

  public ventra_post(url, params, loading): Observable<any> {
    const api_url = 'https://www.ventracloud.com/'; 
    const headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});
    if (loading) {
      // this.showLoader();
      this.spinner.show();
    }
    return this.http.post(api_url + url, params, {headers: headers}).pipe(
      map(this.handleResponse),
      finalize(() => {
        // this.hideLoader();
        this.spinner.hide();
      }),
      catchError(this.handleError)
    );

  }
  public ventra_post1(url, params, loading): Observable<any> {
    const api_url = 'https://www.ventracloud.com/'; 
    const headers = new HttpHeaders({'Content-Type':'application/json', 'Content-Length': '33333'});
    if (loading) {
      // this.showLoader();
      this.spinner.show();
    }
    return this.http.post(api_url + url, params,  {observe: 'response', responseType: 'blob'}).pipe(
      map((result:HttpResponse<Blob>) => {
        console.log(result)
      }),
      finalize(() => {
        // this.hideLoader();
        this.spinner.hide();
      }),
      catchError(this.handleError)
    );

  }
  public ventra_download(url, params, loading): Observable<any> {
    const api_url = 'https://www.ventracloud.com/'; 
    const headers = new HttpHeaders(
      {'Content-Type':'multipart/x-mixed-replace',
      "boundary": "gmserver"}
      );
    if (loading) {
      // this.showLoader();
      this.spinner.show();
    }
    return this.http.post(api_url + url,params ,{responseType: 'blob'}).pipe(
      map(this.handleResponse),
      finalize(() => {
        // this.hideLoader();
        this.spinner.hide();
      }),
      catchError(this.handleError)
    );

  }
  // Toast Messages
  public async presentToast(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }
  // Show the loader for infinite time
  public showLoader() {
    this.loadingCtrl.create({
      message: 'Please wait...',
      backdropDismiss: true
    }).then((res) => {
      res.present();
    });
  }
  public showLoadermsg(msg) {
    this.loadingCtrl.create({
      message: msg,
      backdropDismiss: true
    }).then((res) => {
      res.present();
    });
  }
  // Hide the loader if already created otherwise return error
  public hideLoader() {
    this.loadingCtrl.dismiss().then((res) => {
    }).catch((error) => {
    })
  }
  async presentAlertConfirm(msg,icon) {
    const alert = await this.alertController.create({
      mode: 'ios',
      cssClass: 'custom-alert',
      message: '<img src='+ icon + '><br><strong>'+ msg +'</strong>',
    });

    await alert.present();
    setTimeout(() => {
      alert.dismiss();
    }, 4000);
  }
  public ventra_Video_post(url, loading): Observable<any> { 
    const headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});
    if (loading) {
      // this.showLoader();
      this.spinner.show();
    }
    return this.http.get(url).pipe(
      map(this.handleResponse),
      finalize(() => {
        // this.hideLoader();
        this.spinner.hide();
      }),
      catchError(this.handleError)
    );

  }
}
