import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SpecialRequestPage } from './special-request.page';

const routes: Routes = [
  {
    path: '',
    component: SpecialRequestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SpecialRequestPageRoutingModule {}
