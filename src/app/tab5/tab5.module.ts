import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Tab5PageRoutingModule } from './tab5-routing.module';

import { Tab5Page } from './tab5.page';
import { CalendarModule } from 'ion2-calendar';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    Tab5PageRoutingModule,
    CalendarModule,
    IonicSelectableModule,
    ExploreContainerComponentModule
  ],
  declarations: [Tab5Page]
})
export class Tab5PageModule {}
