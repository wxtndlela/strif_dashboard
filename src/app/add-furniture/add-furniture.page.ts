import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import * as moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-add-furniture',
  templateUrl: './add-furniture.page.html',
  styleUrls: ['./add-furniture.page.scss'],
})
export class AddFurniturePage implements OnInit {

  @Input('start_coords') start_coords: any;

  public addFurnitureForm: FormGroup;
  public Local_Municipality: any;
  public Municipality: any;
  isSubmitted: Boolean = false;
  Type: any[

  ];

  Asset: any[] = [
    {name: 'Masts and foundations', type: 'Street Light'},
    {name: 'Luminaires', type: 'Street Light'},
    {name: 'Electrical Supply', type: 'Street Light'},

  ];

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
  ) {
    this.addFurnitureForm = this.fb.group({
      municipality: ['', Validators.required],
      DISTRICT: ['', Validators.required],
      FEATURE: ['Street Light', Validators.required],
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

    this.get_all_municipality('Mpumalanga');
    this.addFurnitureForm.get('DISTRICT').valueChanges.subscribe(() => {

      if (this.addFurnitureForm.get('DISTRICT').value == '') {

      } else {
        this.Local_Municipality = [];
        this.addFurnitureForm.get('municipality').setValue('');
        this.get_all_local_municipality(this.addFurnitureForm.get('DISTRICT').value)
      }
      console.log('municipality changed', this.addFurnitureForm.get('DISTRICT').value);
    })

    this.addFurnitureForm.get('FEATURE').valueChanges.subscribe(() => {

      this.Type = [];
      let featureType = this.addFurnitureForm.get('FEATURE').value;
      for (let index = 0; index < this.Asset.length; index++) {
        let asset = this.Asset[index]
        if(asset.type == featureType){
          this.Type.push(asset.name)
        }
      }

      this.addFurnitureForm.get('TYPE').setValue('');
    })

  }

  /**
  * errorControl
  * 
  * get errors from form control
  */
  get errorControl() {
    return this.addFurnitureForm.controls;
  }

  /**
   * submit
   */
  public submit() {
    if (this.addFurnitureForm.invalid) return;
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
