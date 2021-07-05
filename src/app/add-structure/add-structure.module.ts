import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddStructurePageRoutingModule } from './add-structure-routing.module';

import { AddStructurePage } from './add-structure.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AddStructurePageRoutingModule
  ],
  declarations: [AddStructurePage]
})
export class AddStructurePageModule {}
