import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TodayEventsPage } from './today-events.page';

const routes: Routes = [
  {
    path: '',
    component: TodayEventsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TodayEventsPageRoutingModule {}
