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
  public SEGMENT_STATUS: any = this.global.SEGMENT_STATUS.value;
  public SURF_TYPE_COUNT: any = this.global.SURF_TYPE_COUNT.value;
  public MUNIC_COUNT: any = this.global.MUNIC_COUNT.value;
  public SEGMENT_STATUS_COUNT: any = this.global.SEGMENT_STATUS_COUNT.value;

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
      case 'SEGMENT_STATUS':
        this.list = this.global.SEGMENT_STATUS.value;
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
      case 'SEGMENT_STATUS':
        this.global.set_SEGMENT_STATUS(this.SEGMENT_STATUS)
        break;
      default:
        break;
    }

  }

}
