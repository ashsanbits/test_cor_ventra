import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RemoteVideosPage } from './remote-videos.page';

const routes: Routes = [
  {
    path: '',
    component: RemoteVideosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RemoteVideosPageRoutingModule {}
