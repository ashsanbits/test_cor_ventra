import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { Tab1PageRoutingModule } from './tab1-routing.module';
import { AgmCoreModule } from '@agm/core';
import { DeviceDetailPage } from '../models/device-detail/device-detail.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab1PageRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBA59zf1B7GGZ6FMgR4whp0GGj1E_BcaIw',
      // libraries: ['places']
    }),
  ],
  declarations: [Tab1Page, DeviceDetailPage]
})
export class Tab1PageModule {}
