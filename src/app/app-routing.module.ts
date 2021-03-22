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
    path: 'parcels',
    loadChildren: () => import('./parcels/parcels.module').then( m => m.ParcelsPageModule)
  },
  {
    path: 'add-doc',
    loadChildren: () => import('./add-doc/add-doc.module').then( m => m.AddDocPageModule)
  },
  {
    path: 'queries',
    loadChildren: () => import('./queries/queries.module').then( m => m.QueriesPageModule)
  },
  {
    path: 'special-request',
    loadChildren: () => import('./special-request/special-request.module').then( m => m.SpecialRequestPageModule)
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
    path: 'change-cell',
    loadChildren: () => import('./change-cell/change-cell.module').then( m => m.ChangeCellPageModule)
  },
  {
    path: 'drivers',
    loadChildren: () => import('./drivers/drivers.module').then( m => m.DriversPageModule)
  },
  {
    path: 'add-response',
    loadChildren: () => import('./add-response/add-response.module').then( m => m.AddResponsePageModule)
  },
  {
    path: '7093',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
