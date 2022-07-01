import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventVideosPage } from './event-videos.page';

const routes: Routes = [
  {
    path: '',
    component: EventVideosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventVideosPageRoutingModule {}
