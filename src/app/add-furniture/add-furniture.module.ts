import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AddFurniturePageRoutingModule } from './add-furniture-routing.module';
import { AddFurniturePage } from './add-furniture.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AddFurniturePageRoutingModule
  ],
  declarations: [AddFurniturePage]
})
export class AddFurniturePageModule { }
