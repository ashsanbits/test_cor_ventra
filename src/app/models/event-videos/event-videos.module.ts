import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventVideosPageRoutingModule } from './event-videos-routing.module';

import { EventVideosPage } from './event-videos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventVideosPageRoutingModule
  ],
  declarations: [EventVideosPage]
})
export class EventVideosPageModule {}
