import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParcelsPage } from './parcels.page';

const routes: Routes = [
  {
    path: '',
    component: ParcelsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParcelsPageRoutingModule {}
