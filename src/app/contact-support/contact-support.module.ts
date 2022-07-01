import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContactSupportPageRoutingModule } from './contact-support-routing.module';

import { ContactSupportPage } from './contact-support.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ExploreContainerComponentModule,
    ContactSupportPageRoutingModule
  ],
  declarations: [ContactSupportPage]
})
export class ContactSupportPageModule {}
