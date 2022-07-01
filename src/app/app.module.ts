import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './services/auth.interceptor';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { CalendarModule } from 'ion2-calendar';
import { SpinnerDialog } from '@awesome-cordova-plugins/spinner-dialog/ngx';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { FileTransfer, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { StreamingMedia } from '@awesome-cordova-plugins/streaming-media/ngx';
import { FCM } from '@awesome-cordova-plugins/fcm/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, CalendarModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
  },
  ScreenOrientation,
  DatePicker,
  SpinnerDialog,
  HTTP,
  File,
  FileTransfer,
  FileTransferObject,
  AndroidPermissions,
  StreamingMedia,
  FCM,
  Network],
  bootstrap: [AppComponent],
})
export class AppModule { }
