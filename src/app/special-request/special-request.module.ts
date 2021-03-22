import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SpecialRequestPageRoutingModule } from './special-request-routing.module';

import { SpecialRequestPage } from './special-request.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SpecialRequestPageRoutingModule
  ],
  declarations: [SpecialRequestPage]
})
export class SpecialRequestPageModule {}
