import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RemoteplaybackPage } from './remoteplayback.page';

const routes: Routes = [
  {
    path: '',
    component: RemoteplaybackPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RemoteplaybackPageRoutingModule {}
