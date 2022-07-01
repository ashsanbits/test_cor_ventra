import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RemoteVideosPageRoutingModule } from './remote-videos-routing.module';

import { RemoteVideosPage } from './remote-videos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RemoteVideosPageRoutingModule
  ],
  declarations: [RemoteVideosPage]
})
export class RemoteVideosPageModule {}
