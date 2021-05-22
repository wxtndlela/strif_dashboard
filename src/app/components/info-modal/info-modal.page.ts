import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { AlertService } from '../../../services/alert.service';
import { ToasterService } from '../../../services/toaster.service';
import { PopoverController, ModalController, ToastController, LoadingController, AlertController, NavController } from '@ionic/angular';
import { GlobalSettings } from '../../../services/global.service';
import { FileService } from '../../../services/file.service';

@Component({
  selector: 'app-info-modal',
  templateUrl: './info-modal.page.html',
  styleUrls: ['./info-modal.page.scss'],
})

export class InfoModalPage implements OnInit {

  @Input('segment_id') segment_id: any;
  public Segment: any;
  public Artifact: any = [];
  public Assesment: any;
  slideOpts = {
    initialSlide: 1,
    speed: 400,
    autoplay: {
      delay: 1000,
    }
  };

  constructor(
    private api: ApiService,
    private toaster: ToasterService,
    private Alerter: AlertService,
    public popoverController: PopoverController,
    private global: GlobalSettings,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private file: FileService
  ) {

  }

  ngOnInit() {
    this.get_segment();
    this.get_artifacts();
    this.get_segment_defects();
  }

  /**
   * get_segment
   */
  public async get_segment() {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    })

    await loading.present();

    this.api.get_segment(this.segment_id).subscribe(response => {
      loading.dismiss();
      // console.log('segemnt:', response);
      this.Segment = response.data;
    })
  }

  /**
   * start_new_analysis
   */
  public start_new_analysis() {
    this.navCtrl.navigateForward(["analyse", {
      'segment_id': this.segment_id
    }])
  }

  /**
   * dismiss
   */
  public dismiss() {
    this.modalCtrl.dismiss()
  }

  /**
   * delete_segment
   */
  public async delete_segment() {
    const alert = await this.alertCtrl.create({
      header: 'delete segment',
      message: 'Are you sure to delete segment : ' + this.segment_id + ' ?',
      buttons: [
        {
          text: 'Delete',
          role: 'danger',
          handler: () => {
            this.do_delete_segment();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    })

    await alert.present();
  }

  /**
   * do_delete_segment
   */
  public async do_delete_segment() {
    const loading = await this.loadingCtrl.create({
      message: 'Deleteing segement ...'
    })

    await loading.present();
    this.api.remove_segment(this.segment_id).subscribe(response => {
      loading.dismiss();
      console.log(response)
      if (response.status == 0) {
        this.toaster.successToast(response.msg);
      } else {
        this.toaster.warnToast(response.msg);
      }
    })
  }

  /**
   * get_artifacts
   */
  public async get_artifacts() {

    this.api.get_artifacts_by_segment(1).subscribe(response => {
      // console.log('artifacts:', response);
      this.Artifact = response.data;
    })
  }

  /**
   * get_segment_defects
   */
  public async get_segment_defects() {

    this.api.get_artifacts_by_segment(1).subscribe(response => {
      // console.log('defects:', response);
      this.Assesment = response.data[0];
    })

  }

  /**
   * export_as
   */
  public async export_as() {
    // this.file.exportAsCsvFile(response.data, 'Segment - ' + this.segment_id)
    const alert = await this.alertCtrl.create({
      header: 'Export',
      message: 'Export file as ?',
      buttons: [
        {
          text: 'CSV',
          role: 'danger',
          handler: () => {
            let data = this.Segment;
            this.file.exportAsCsvFile(data, 'Segment - ' + this.segment_id);
          }
        },
        {
          text: 'EXCEL',
          role: 'danger',
          handler: () => {
            this.file.exportAsExcelFile(this.Segment, 'Segment - ' + this.segment_id);
          }
        }
      ]
    })

    await alert.present();
  }
}
