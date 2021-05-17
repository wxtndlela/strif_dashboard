import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'folder/Inbox',
    pathMatch: 'full'
  },
  {
    path: 'documents',
    loadChildren: () => import('./documents/documents.module').then( m => m.DocumentsPageModule)
  },
  {
    path: 'users',
    loadChildren: () => import('./users/users.module').then( m => m.UsersPageModule)
  },

  {
    path: 'add-doc',
    loadChildren: () => import('./add-doc/add-doc.module').then( m => m.AddDocPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'change-pass',
    loadChildren: () => import('./change-pass/change-pass.module').then( m => m.ChangePassPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'routes',
    loadChildren: () => import('./routes/routes.module').then( m => m.RoutesPageModule)
  },
  {
    path: 'assets',
    loadChildren: () => import('./assets/assets.module').then( m => m.AssetsPageModule)
  },
  {
    path: 'surveys',
    loadChildren: () => import('./surveys/surveys.module').then( m => m.SurveysPageModule)
  },
  {
    path: 'assesments',
    loadChildren: () => import('./assesments/assesments.module').then( m => m.AssesmentsPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },  {
    path: 'forgot-pass',
    loadChildren: () => import('./forgot-pass/forgot-pass.module').then( m => m.ForgotPassPageModule)
  },
  {
    path: 'add-segment',
    loadChildren: () => import('./add-segment/add-segment.module').then( m => m.AddSegmentPageModule)
  },
  {
    path: 'traffic',
    loadChildren: () => import('./traffic/traffic.module').then( m => m.TrafficPageModule)
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
