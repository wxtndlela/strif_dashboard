import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import * as moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, LoadingController } from '@ionic/angular';

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
  isSubmitted: Boolean = true;

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
  ) {
    this.addStructureForm = this.fb.group({
      municipality: ['', Validators.required],
      DISTRICT: ['', Validators.required],
      STRUCTURE_CLASS: ['Bridge', Validators.required],
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

  }

  ngOnInit() {
    this.Type = this.Bridge;

    this.get_all_municipality('Mpumalanga');
    this.addStructureForm.get('DISTRICT').valueChanges.subscribe(() => {

      if (this.addStructureForm.get('DISTRICT').value == '') {

      } else {
        this.Local_Municipality = [];
        this.addStructureForm.get('municipality').setValue('');
        this.get_all_local_municipality(this.addStructureForm.get('DISTRICT').value)
      }
      console.log('municipality changed', this.addStructureForm.get('DISTRICT').value);
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
