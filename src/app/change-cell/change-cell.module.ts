import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChangeCellPageRoutingModule } from './change-cell-routing.module';

import { ChangeCellPage } from './change-cell.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChangeCellPageRoutingModule
  ],
  declarations: [ChangeCellPage]
})
export class ChangeCellPageModule {}
