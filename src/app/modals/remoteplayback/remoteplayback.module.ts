import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RemoteplaybackPageRoutingModule } from './remoteplayback-routing.module';

import { RemoteplaybackPage } from './remoteplayback.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RemoteplaybackPageRoutingModule
  ],
  declarations: [RemoteplaybackPage]
})
export class RemoteplaybackPageModule {}
