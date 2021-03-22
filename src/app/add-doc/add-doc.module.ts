import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddDocPageRoutingModule } from './add-doc-routing.module';

import { AddDocPage } from './add-doc.page';
import { EditorModule } from "@tinymce/tinymce-angular";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AddDocPageRoutingModule,
    EditorModule
  ],
  declarations: [AddDocPage]
})
export class AddDocPageModule {}
