import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddResponsePageRoutingModule } from './add-response-routing.module';

import { AddResponsePage } from './add-response.page';
import { EditorModule } from "@tinymce/tinymce-angular";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AddResponsePageRoutingModule,
    EditorModule
  ],
  declarations: [AddResponsePage]
})
export class AddResponsePageModule {}
