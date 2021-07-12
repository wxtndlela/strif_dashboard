import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import * as moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, LoadingController } from '@ionic/angular';
import { GlobalSettings } from '../../services/global.service';

@Component({
  selector: 'app-add-structure',
  templateUrl: './add-structure.page.html',
  styleUrls: ['./add-structure.page.scss'],
})

export class AddStructurePage implements OnInit {

  @Input('start_coords') start_coords: any;

  public addStructureForm: FormGroup;
  public Local_Municipality: any;
  public Municipality: any;
  isSubmitted: Boolean = false;

  Culvert: any[] = [
    'Major Culvert',
    'Lesser Culvert'
  ];

  Bridge: any[] = [
    'Bridge (General)',
    'Bridge (Arch)',
    'Bridge (Cable)',
    'Bridge (Cellular)'
  ];

  Type: any[];

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    private global: GlobalSettings

  ) {
    this.addStructureForm = this.fb.group({
      municipality: ['', Validators.required],
      DISTRICT: ['', Validators.required],
      STRUCTURE_CLASS: ['', Validators.required],
      height_fill: ['', Validators.required],
      cell_length: ['', Validators.required],
      height: ['', Validators.required],
      width: ['', Validators.required],
      FEATURE_CROSSED: ['', Validators.required],
      TYPE: ['', Validators.required],
      START_LATITUDE: ['', Validators.required],
      START_LONGITUDE: ['', Validators.required],
      COMMENTS: ['', Validators.nullValidator],
    });

    this.Municipality = (this.global.Province.value)[0].District;

  }

  ngOnInit() {
    this.Type = this.Bridge;

    this.addStructureForm.get('DISTRICT').valueChanges.subscribe(() => {
      let District_code = this.addStructureForm.get('DISTRICT');
      if (District_code.value != '') {
        for (let index = 0; index < this.Municipality.length; index++) {
          const District = this.Municipality[index];
          if (District_code.value == District.code) {
            this.addStructureForm.get('municipality').setValue('');
            this.Local_Municipality = [];
            const Local_Municipality = District.Municipality;
            for (let index = 0; index < Local_Municipality.length; index++) {
              const element = Local_Municipality[index];
              this.Local_Municipality.push(element);
            }
            /*take a */ break;
          }
        }
      }
    })

    this.addStructureForm.get('STRUCTURE_CLASS').valueChanges.subscribe(() => {

      switch (this.addStructureForm.get('STRUCTURE_CLASS').value) {
        case 'Bridge':
          this.Type = this.Bridge;
          break;
        case 'Culvert':
          this.Type = this.Culvert;
          break;

        default:
          this.Type = [this.addStructureForm.get('STRUCTURE_CLASS').value]
          break;
      }

      this.addStructureForm.get('TYPE').setValue('');
    })

  }

  /**
  * errorControl
  * 
  * get errors from form control
  */
  get errorControl() {
    return this.addStructureForm.controls;
  }

  /**
   * submit
   */
  public submit() {
    if (this.addStructureForm.invalid) return;
  }


  /**
   * dissmiss
   */
  public dismiss_modal() {
    this.modalCtrl.dismiss();
  }

  private async get_all_municipality(province) {
    const loading = await this.loadingCtrl.create({
      message: 'getting district municipalities ...'
    })

    loading.present();

    this.api.get_all_municipality_by_province(province).subscribe(res => {
      loading.dismiss();
      this.Municipality = res.data;
    })
  }

  private async get_all_local_municipality(municipality_id) {
    const loading = await this.loadingCtrl.create({
      message: 'getting local municipalities ...'
    })

    loading.present();

    this.api.get_all_local_municipality(municipality_id).subscribe(res => {
      loading.dismiss();
      this.Local_Municipality = res.data;
    })

  }

}
