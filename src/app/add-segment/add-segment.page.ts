import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../../services/api.service';
import * as moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-segment',
  templateUrl: './add-segment.page.html',
  styleUrls: ['./add-segment.page.scss'],
})
export class AddSegmentPage implements OnInit {

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private modalCtrl: ModalController
  ) {
    this.addSegmentForm = this.fb.group({
      municipality: ['', Validators.required],
      DISTRICT: ['', Validators.required],
      surface_type: ['', Validators.required],
      TERR_CLASS: ['', Validators.required],
      RCAM_CLASS: ['', Validators.required]
    });
  }

  public addSegmentForm: FormGroup;
  @Input('snapped_points') snapped_points;
  @Input('distance') distance;
  @Input('start_coords') start_coords;
  @Input('end_coords') end_coords;

  public day = moment().add(0, 'd').format().toString();



  ngOnInit() {
    console.log('snapped_points', this.snapped_points);
    console.log('distance', this.distance);
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
    let start_date = '2016-06-22 19:10:25-07' ; //this.day.substr(0, 10) + ' ' + this.day.substr(11, 11);
    let end_date = '2016-06-22 19:10:25-07' ; //this.day.substr(0, 10) + ' ' + this.day.substr(11, 11);
    let distance = this.distance;
    let start_coords = JSON.stringify(this.start_coords);
    let end_coords = JSON.stringify(this.end_coords);
    let surface_type = this.addSegmentForm.get('surface_type').value;
    let TERR_CLASS = this.addSegmentForm.get('TERR_CLASS').value;
    let RCAM_CLASS = this.addSegmentForm.get('RCAM_CLASS').value;
    let STATUS = 'not assessed';

    console.log(snap_points, 'snap_points')

    this.api.add_segment(seg_id, snap_points, sys_user_id, municipality, DISTRICT, start_date, end_date, distance, start_coords, end_coords, surface_type, TERR_CLASS, RCAM_CLASS, STATUS).subscribe(response =>{
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
