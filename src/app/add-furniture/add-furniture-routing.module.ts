import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddFurniturePage } from './add-furniture.page';

const routes: Routes = [
  {
    path: '',
    component: AddFurniturePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddFurniturePageRoutingModule {}
