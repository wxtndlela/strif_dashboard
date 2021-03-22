import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChangeCellPage } from './change-cell.page';

const routes: Routes = [
  {
    path: '',
    component: ChangeCellPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChangeCellPageRoutingModule {}
