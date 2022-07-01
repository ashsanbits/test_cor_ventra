import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Tab6PageRoutingModule } from './tab6-routing.module';

import { Tab6Page } from './tab6.page';
import { CalendarModule } from 'ion2-calendar/dist/calendar.module';
import { IonicSelectableModule } from 'ionic-selectable';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Tab6PageRoutingModule,
    CalendarModule,
    IonicSelectableModule,
    ExploreContainerComponentModule
  ],
  declarations: [Tab6Page]
})
export class Tab6PageModule {}
