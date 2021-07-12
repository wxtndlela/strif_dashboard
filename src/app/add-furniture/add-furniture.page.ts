import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import * as moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, LoadingController } from '@ionic/angular';
import { GlobalSettings } from '../../services/global.service';

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
  Type: any[] = [];
  Road_furniture: any;
  Places: any;

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    private global: GlobalSettings
  ) {
    this.addFurnitureForm = this.fb.group({

      municipality: ['', Validators.required],
      DISTRICT: ['', Validators.required],
      FEATURE: ['', Validators.required],
      TYPE: ['', Validators.required],
      DESCRIPTION: ['', Validators.required],

      NAME: ['', Validators.nullValidator], //BUS STOP NAME
      SERVICE: ['', Validators.nullValidator],//POLE, MANHOLE
      DIAMETER: ['', Validators.nullValidator],//MANHOLE (m)
      DISTANCE_FROM_ROAD: ['', Validators.nullValidator],

      height: ['', Validators.required],
      width: ['', Validators.required],
      length: ['', Validators.nullValidator],//SIDE WALK(m)
      quantity: ['', Validators.nullValidator],//Bollards

      START_LATITUDE: ['', Validators.required],
      START_LONGITUDE: ['', Validators.required],
      COMMENTS: ['', Validators.nullValidator],

    });

    this.Road_furniture = this.global.Road_furniture.value;
    this.Places = this.global.Province.value;
    this.Municipality = (this.global.Province.value)[0].District;
  }

  ngOnInit() {

    this.addFurnitureForm.get('DISTRICT').valueChanges.subscribe(() => {
      let District_code = this.addFurnitureForm.get('DISTRICT');
      if (District_code.value != '') {
        for (let index = 0; index < this.Municipality.length; index++) {
          const District = this.Municipality[index];
          if (District_code.value == District.code) {
            this.addFurnitureForm.get('municipality').setValue('');
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


    this.addFurnitureForm.get('FEATURE').valueChanges.subscribe(() => {
      let featureType_name = this.addFurnitureForm.get('FEATURE');
      if (featureType_name.value != '') {
        for (let index = 0; index < this.Road_furniture.length; index++) {
          const Feature = this.Road_furniture[index];
          if (featureType_name.value == Feature.name) {
            const Type = Feature.type;
            this.Type = [];
            for (let index = 0; index < Type.length; index++) {
              const element = Type[index];
              this.Type.push(element.name);
              console.log(element.name);
            }
            /*take a */ break;
          }
        }
      }
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
