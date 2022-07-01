import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AfterLoginService } from './services/afterlogin.service';
import { BeforeLoginService } from './services/before-login.service';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate:[AfterLoginService]
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule),
    canActivate:[BeforeLoginService]
  },
  {
    path: 'profile',
    loadChildren: () => import('./models/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'update-password',
    loadChildren: () => import('./models/update-password/update-password.module').then( m => m.UpdatePasswordPageModule)
  },
  {
    path: 'test',
    loadChildren: () => import('./test/test.module').then( m => m.TestPageModule)
  },
  {
    path: 'forget-password',
    loadChildren: () => import('./forget-password/forget-password.module').then( m => m.ForgetPasswordPageModule)
  },
  {
    path: 'contact-support',
    loadChildren: () => import('./contact-support/contact-support.module').then( m => m.ContactSupportPageModule)
  },
  {
    path: 'remoteplayback',
    loadChildren: () => import('./modals/remoteplayback/remoteplayback.module').then( m => m.RemoteplaybackPageModule)
  },
  {
    path: 'imageview',
    loadChildren: () => import('./models/imageview/imageview.module').then( m => m.ImageviewPageModule)
  },
  {
    path: 'event-videos',
    loadChildren: () => import('./models/event-videos/event-videos.module').then( m => m.EventVideosPageModule)
  },
  {
    path: 'today-events',
    loadChildren: () => import('./today-events/today-events.module').then( m => m.TodayEventsPageModule)
  },
  {
    path: 'videos',
    loadChildren: () => import('./videos/videos.module').then( m => m.VideosPageModule)
  },
  {
    path: 'remote-videos',
    loadChildren: () => import('./models/remote-videos/remote-videos.module').then( m => m.RemoteVideosPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
