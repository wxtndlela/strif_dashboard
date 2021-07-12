import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../../services/api.service';
import * as moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, LoadingController } from '@ionic/angular';
import { GlobalSettings } from '../../services/global.service';

@Component({
  selector: 'app-add-segment',
  templateUrl: './add-segment.page.html',
  styleUrls: ['./add-segment.page.scss'],
})

export class AddSegmentPage implements OnInit {

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    private global: GlobalSettings

  ) {
    this.addSegmentForm = this.fb.group({
      municipality: ['', Validators.required],
      DISTRICT: ['', Validators.required],
      surface_type: ['', Validators.required],
      TERR_CLASS: ['', Validators.required],
      RCAM_CLASS: ['', Validators.required],
      Road_Name: ['', Validators.required],
      Lane_Code: ['', Validators.required],
      Road_Width: ['', Validators.required],
      Gradient: ['', Validators.required],
      Node_Type: ['', Validators.required],
      Auth_RD_Dir: ['', Validators.required],
      Status: ['', Validators.required],
    });

    this.Municipality = (this.global.Province.value)[0].District;
  }

  public addSegmentForm: FormGroup;
  @Input('snapped_points') snapped_points;
  @Input('distance') distance;
  @Input('start_coords') start_coords;
  @Input('end_coords') end_coords;
  public Local_Municipality: any;
  public Municipality: any;


  public day = moment().add(0, 'd').format().toString();
  public isSubmitted = false;


  ngOnInit() {

    this.addSegmentForm.get('DISTRICT').valueChanges.subscribe(() => {
      let District_code = this.addSegmentForm.get('DISTRICT');
      if (District_code.value != '') {
        for (let index = 0; index < this.Municipality.length; index++) {
          const District = this.Municipality[index];
          if (District_code.value == District.code) {
            this.addSegmentForm.get('municipality').setValue('');
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

  /**
   * submit
   */
  public async submit() {
    let SEG_ID = 'this';
    let snap_points = JSON.stringify(this.snapped_points);
    let sys_user_id = localStorage.getItem('uuid');
    let MUNIC = this.addSegmentForm.get('municipality').value;
    let DISTRICT = this.addSegmentForm.get('DISTRICT').value;

    let START_DATE = moment().format('YYYY-MM-DD HH:MM:00');
    let END_DATE = moment().format('YYYY-MM-DD HH:MM:00');

    let NODE_TYPE = this.addSegmentForm.get('Node_Type').value;
    let SADC_ROUTE = '';
    let AUTH_RD_DIR = this.addSegmentForm.get('Auth_RD_Dir').value;
    let START_KM = '0';
    let END_KM = this.distance;

    let AUTH_ID = '';
    let AUTH_ROAD_ID = '';
    let RDDA_ID = '';
    let LEG_SEG_ID = '';
    let ROUTE = '';

    let END_LATITUDE = this.end_coords.lat;
    let END_LONGITUDE = this.end_coords.lon;
    let START_LATITUDE = this.start_coords.lat;
    let START_LONGITUDE = this.start_coords.lon;

    let START_DESC = '';
    let END_DESC = '';
    let GIS_LINK_ID = '';

    let SURF_TYPE = this.addSegmentForm.get('surface_type').value;
    let TERR_CLASS = this.addSegmentForm.get('TERR_CLASS').value;
    let RCAM_CLASS = this.addSegmentForm.get('RCAM_CLASS').value;
    let ROAD_WIDTH = this.addSegmentForm.get('Road_Width').value;
    let GRADIENT = this.addSegmentForm.get('Gradient').value;
    let NO_LANES = '';
    let NO_SHOULDER = '';
    let ROAD_TYPE = '';
    let BASE_DATE = moment().format('YYYY-MM-DD HH:MM:00');
    let SURFACE_DATE = ''
    let ROAD_NAME = this.addSegmentForm.get('Road_Name').value;
    let LANE_CODE = this.addSegmentForm.get('Lane_Code').value;
    let SEGMENT_STATUS = 'not assessed';

    let LANE_SEG_ID = '';
    let CL_OFFSET = '';
    let SHOULDER_TYPE = '';
    let OWNER = localStorage.getItem('uuid');

    this.api.add_segment(
      snap_points,
      SEG_ID,
      sys_user_id,
      MUNIC,
      DISTRICT,
      AUTH_ID,
      AUTH_ROAD_ID,
      RDDA_ID,
      LEG_SEG_ID,
      ROUTE,
      START_DATE,
      END_DATE,
      NODE_TYPE,
      SADC_ROUTE,
      AUTH_RD_DIR,
      START_KM,
      END_KM,
      END_LATITUDE,
      END_LONGITUDE,
      START_LATITUDE,
      START_LONGITUDE,
      START_DESC,
      END_DESC,
      GIS_LINK_ID,
      SURF_TYPE,
      TERR_CLASS,
      RCAM_CLASS,
      ROAD_WIDTH,
      GRADIENT,
      NO_LANES,
      NO_SHOULDER,
      ROAD_TYPE,
      BASE_DATE,
      SURFACE_DATE,
      ROAD_NAME,
      LANE_CODE,
      SEGMENT_STATUS,
      LANE_SEG_ID,
      CL_OFFSET,
      SHOULDER_TYPE,
      OWNER
    ).subscribe(response => {
      console.log(response)
      this.dismiss_modal();
    })
  }

  /**
  * errorControl
  * 
  * get errors from form control
  */
  get errorControl() {
    return this.addSegmentForm.controls;
  }

  /**
   * dissmiss
   */
  public dismiss_modal() {
    this.modalCtrl.dismiss();
  }

}
