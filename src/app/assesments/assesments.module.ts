import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AssesmentsPageRoutingModule } from './assesments-routing.module';

import { AssesmentsPage } from './assesments.page';

import { GoogleMapsModule } from '@angular/google-maps'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AssesmentsPageRoutingModule,
    GoogleMapsModule
  ],
  declarations: [AssesmentsPage]
})
export class AssesmentsPageModule {}
