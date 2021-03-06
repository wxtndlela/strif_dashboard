import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleChartsModule } from 'angular-google-charts';

import { IonicModule } from '@ionic/angular';

import { InfoModalPageRoutingModule } from './info-modal-routing.module';

import { InfoModalPage } from './info-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InfoModalPageRoutingModule,
    GoogleChartsModule
  ],
  declarations: [InfoModalPage]
})
export class InfoModalPageModule {}
