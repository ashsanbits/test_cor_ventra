import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TodayEventsPageRoutingModule } from './today-events-routing.module';

import { TodayEventsPage } from './today-events.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TodayEventsPageRoutingModule
  ],
  declarations: [TodayEventsPage]
})
export class TodayEventsPageModule {}
