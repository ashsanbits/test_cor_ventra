import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Tab3Page } from './tab3.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { Tab3PageRoutingModule } from './tab3-routing.module';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';   // agm-direction
import { CalendarModule } from 'ion2-calendar';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    RouterModule.forChild([{ path: '', component: Tab3Page }]),
    Tab3PageRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBmdMnJY62bTAjU3Sk3IVGGOIMPSe7OMjQ',
      libraries: ['places','direction']
    }),
    ReactiveFormsModule,
    FormsModule,
    AgmDirectionModule,
    CalendarModule
  ],
  declarations: [Tab3Page]
})
export class Tab3PageModule {}
