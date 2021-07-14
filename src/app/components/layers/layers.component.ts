import { Component, Input, OnInit } from '@angular/core';
import { GlobalSettings } from '../../../services/global.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-layers',
  templateUrl: './layers.component.html',
  styleUrls: ['./layers.component.scss'],
})
export class LayersComponent implements OnInit {

  @Input('event') event: any;
  public list: any;


  public LayersForm: FormGroup;
  public MUNIC: any = this.global.MUNIC.value;
  public SURF_TYPE: any = this.global.SURF_TYPE.value;


  constructor(
    public global: GlobalSettings,
    private fb: FormBuilder,

  ) {
    this.LayersForm = this.fb.group({
      isChecked: ['', [Validators.required]],
    });



  }

  ngOnInit() {

    switch (this.event) {
      case 'SURF_TYPE':
        this.list = this.global.SURF_TYPE.value;
        break;
      case 'MUNIC':
        this.list = this.global.MUNIC.value;
        break;
      default:
        break;
    }

  }

  check_item_clicked(item: any) {

    switch (this.event) {
      case 'SURF_TYPE':
        this.global.set_SURF_TYPE(this.SURF_TYPE);
        break;
      case 'MUNIC':
        this.global.set_MUNIC(this.MUNIC)
        break;
      default:
        break;
    }

  }

}
