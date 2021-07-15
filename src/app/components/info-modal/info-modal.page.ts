import { AfterViewInit, Component, ElementRef, ViewChild, OnInit, Input } from '@angular/core';
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
  @Input('furniture_id') furniture_id: any;
  @Input('structure_id') structure_id: any;
  @Input('traffic_station_id') traffic_station_id: any;
  @ViewChild('pieChart') pieChart: ElementRef;

  public Segment: any;
  public Station: any;
  public Furniture: any;
  public Structure: any;
  public Artifact: any = [];
  public Assesment: any;
  slideOpts = {
    initialSlide: 1,
    speed: 400,
    autoplay: {
      delay: 1000,
    }
  };

  chart_data: any[] = [];

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

    if (this.segment_id) {
      this.get_segment();
      this.get_artifacts();
      this.get_segment_defects();
    }else if (this.structure_id) {
      this.get_structure();
    }else if (this.furniture_id) {
      this.get_furniture();
    }else if (this.traffic_station_id) {
      this.get_traffic_station();
    }

  }


  /**
   * get_traffic_station
   */
  public async get_traffic_station() {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    })

    await loading.present();
    console.log('traffic_station_id :', this.traffic_station_id)
    this.api.get_traffic_station(this.traffic_station_id).subscribe(response => {
      loading.dismiss();

      this.chart_data.push(['Vehicle_type', 'Num of vehicle']);
      this.chart_data.push(['LIGHT', Number(response.data[0].LIGHT)]);
      this.chart_data.push(['HEAVY', Number(response.data[0].HEAVY)]);
      this.chart_data.push(['MOTORBIKE', Number(response.data[0].BIKE)]);

      google.charts.load('current', { packages: ['corechart'] });
      google.charts.setOnLoadCallback(this.drawChart);
      this.Station = response.data[0];
    })
  }

  ngAfterViewInit() {
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(this.drawChart);
  }



  drawChart = () => {


    let chart_data = [
      ['Task', 'Hours per Day'],
      ['Work', 11],
      ['Eat', 2],
      ['Commute', 2],
      ['Watch TV', 2],
      ['Sleep', 7]
    ]

    const data = google.visualization.arrayToDataTable(this.chart_data)

    const options: any = {
      title: "Summary",
      legend: { position: 'top' }
    };

    const chart = new google.visualization.PieChart(
      this.pieChart.nativeElement
    );

    chart.draw(data, options);
  };


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
      message: 'Deleting segement ...'
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

    this.api.get_artifacts_by_segment(this.segment_id).subscribe(response => {
      console.log('artifacts:', response);
      this.Artifact = response.data;
    })
  }

  /**
   * get_segment_defects
   */
  public async get_segment_defects() {

    this.api.get_segment_defects(this.segment_id).subscribe(response => {
      console.log('defects:', response);
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

            if (this.Segment) {
              let data = this.Segment;
              this.file.exportAsCsvFile(data, 'Segment - ' + this.segment_id);

            } else if (this.traffic_station_id) {
              let data = this.Station;
              this.file.exportAsCsvFile(data, 'Traffic Station - S' + this.traffic_station_id);

            }
          }
        },
        {
          text: 'EXCEL',
          role: 'danger',
          handler: () => {
            if (this.Segment) {
              let data = this.Segment;
              this.file.exportAsExcelFile(data, 'Segment - ' + this.segment_id);

            } else if (this.traffic_station_id) {
              let data = this.Station;
              this.file.exportAsExcelFile(data, 'Traffic Station - S' + this.traffic_station_id);
            }
          }
        }
      ]
    })

    await alert.present();
  }


  /**
 * delete_station
 */
  public async delete_station() {
    const alert = await this.alertCtrl.create({
      header: 'delete station',
      message: 'Are you sure to delete traffic station : S' + this.traffic_station_id + ' ?',
      buttons: [
        {
          text: 'Delete',
          role: 'danger',
          handler: () => {
            this.do_delete_station();
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
   * do_delete_station
   */
  public async do_delete_station() {
    const loading = await this.loadingCtrl.create({
      message: 'Deleting station ...'
    })

    await loading.present();
    this.api.remove_traffic_station(this.traffic_station_id).subscribe(response => {
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
   * get_structure
   */
  public async get_structure() {
    this.api.get_structure(this.structure_id).subscribe(res => {
      console.log('Structure:', res);
      this.Structure = res.data[0];
    })
  }

  /**
   * get_furniture
   */
  public async get_furniture() {
    this.api.get_furniture(this.furniture_id).subscribe(res => {
      console.log('Furniture:', res);
      this.Furniture = res.data[0];
    })
  }
}
