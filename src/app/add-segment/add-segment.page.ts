import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../../services/api.service';
import * as moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, LoadingController } from '@ionic/angular';

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
    console.log('snapped_points', this.snapped_points);
    console.log('distance', this.distance);
    this.get_all_municipality('Mpumalanga');


    this.addSegmentForm.get('DISTRICT').valueChanges.subscribe(() => {
 
      if(this.addSegmentForm.get('DISTRICT').value == ''){

      }else{
        this.Local_Municipality = [];
        this.addSegmentForm.get('municipality').setValue('');
        this.get_all_local_municipality(this.addSegmentForm.get('DISTRICT').value)
      }
      console.log('municipality changed', this.addSegmentForm.get('DISTRICT').value);
    })
  }

  private async get_all_local_municipality(municipality_id) {
    const loading = await this.loadingCtrl.create({
      message:'getting local municipalities ...'
    })

    loading.present();

    this.api.get_all_local_municipality(municipality_id).subscribe(res => {
      loading.dismiss();
      this.Local_Municipality = res.data;
    })

    
  }

  private async get_all_municipality(province) {
    const loading = await this.loadingCtrl.create({
      message:'getting district municipalities ...'
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
    let seg_id = 'this';
    let snap_points = JSON.stringify(this.snapped_points);
    let sys_user_id = localStorage.getItem('uuid');
    let municipality = this.addSegmentForm.get('municipality').value;
    let DISTRICT = this.addSegmentForm.get('DISTRICT').value;
    let start_date = '2016-06-22 19:10:25-07'; //this.day.substr(0, 10) + ' ' + this.day.substr(11, 11);
    let end_date = '2016-06-22 19:10:25-07'; //this.day.substr(0, 10) + ' ' + this.day.substr(11, 11);
    let distance = this.distance;
    let start_coords = JSON.stringify(this.start_coords);
    let end_coords = JSON.stringify(this.end_coords);
    let surface_type = this.addSegmentForm.get('surface_type').value;
    let TERR_CLASS = this.addSegmentForm.get('TERR_CLASS').value;
    let RCAM_CLASS = this.addSegmentForm.get('RCAM_CLASS').value;
    let STATUS = 'not assessed';

    console.log(snap_points, 'snap_points')

    this.api.add_segment(seg_id, snap_points, sys_user_id, municipality, DISTRICT, start_date, end_date, distance, start_coords, end_coords, surface_type, TERR_CLASS, RCAM_CLASS, STATUS).subscribe(response => {
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
