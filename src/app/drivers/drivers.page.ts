import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AlertService } from '../../services/alert.service';
import { ToasterService } from '../../services/toaster.service';
import { PopoverController , ModalController, LoadingController} from '@ionic/angular';
import { FilterComponent } from '../components/filter/filter.component';
import { GlobalSettings } from '../../services/global.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.page.html',
  styleUrls: ['./drivers.page.scss'],
})
export class DriversPage implements OnInit {

  //value from prior page
  @Input('request_id') request_id: String;

  public Driver: any = [];
  public Request: any = [];
  public distance = 0;
  public day = moment().add(0, 'd').format().toString();

  public results_count = 0;
  public searchText = '';
  public SortBy: String = '';
  public filterBy: String = '';

  public avater_img = '../../assets/avater-default.png';

  public selectForm: FormGroup;
  public isSubmitted = false;
  public isSeleceted = false;
  public selection = '';
  private driver_id = '';

  constructor(
    private api: ApiService,
    private toaster: ToasterService,
    private Alerter: AlertService,
    public popoverController: PopoverController,
    private global: GlobalSettings,
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController
  ) {
    if (this.isSeleceted) {
      this.selection = "Set pricing"
    } else if (!this.isSeleceted) {
      this.selection = "Select a driver"
    }
    this.selectForm = this.fb.group({
      price: ['', [Validators.required, Validators.pattern("[0-9]*")]]
    });
  }

  ngOnInit() {
    this.global.get_driver_filter_by().subscribe(async (value) => {
      this.filterBy = await value;
      this.get_Drivers();
    });
    this.global.get_driver_sort_by().subscribe(async (value) => {
      this.SortBy = await value;
      this.get_Drivers();
    });

    this.get_request();
  }

  /**
   * get_Drivers
   */
  public get_Drivers() {
    this.api.get_all_drivers(this.searchText, this.SortBy, this.filterBy).subscribe(async res => {
      console.log(await res);
      this.results_count = res.rows;
      this.Driver = res.data;
    })
  }

  /**
  * get_request details
  */
  public get_request() {
    this.api.get_request(this.request_id).subscribe(async res => {
      console.log(await res);
      this.Request = res.data[0];
      this.distance = res.distance
    })
  }

  /**
   * errorControl
   * 
   * get errors from form control
   */
  get errorControl() {
    return this.selectForm.controls;
  }

  async presentPopover(ev: any, event) {
    String(event).substr
    const popover = await this.popoverController.create({
      component: FilterComponent,
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true,
      componentProps: {
        event: event
      },
    });
    return await popover.present();
  }

  /**
   * make_selection
   */
  public make_selection(driver_id) {
    this.isSeleceted = true;
    this.driver_id = driver_id;
    this.selection = "Set pricing";
  }



  /**
   * submit form
   */
  public async submit() {
    this.isSubmitted = true;

    //check if form is valid before proceeding
    if (this.selectForm.invalid) {
      console.log(this.selectForm.get('price').errors)
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Please wait'
    })

    let requsest_id = this.request_id;
    let delivery_status = 'pending';
    let driver_id = this.driver_id;
    let addedondatetime = this.day.substr(0, 10) + ' ' + this.day.substr(11, 5);

    loading.present();

    this.api.add_new_delivery(requsest_id, delivery_status, driver_id, addedondatetime).subscribe(res =>{
      loading.dismiss();
      if(res.status == 0){
        this.toaster.successToast(res.msg);
        this.dismiss();
      }
      else{
        this.toaster.warnToast(res.msg);
      }
      console.log(res)
    })
  }

  /**
  * cancel current selection
  */
  public dismiss() {
    this.modalCtrl.dismiss();
  }

}
