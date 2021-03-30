import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AssesmentsPage } from './assesments.page';

const routes: Routes = [
  {
    path: '',
    component: AssesmentsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssesmentsPageRoutingModule {}
