import { Component, OnInit, AfterViewInit } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps'
import { ApiService } from '../../services/api.service';
import { AlertService } from '../../services/alert.service';
import { ToasterService } from '../../services/toaster.service';
import { FilterComponent } from '../components/filter/filter.component';
import { GlobalSettings } from '../../services/global.service';
import { InfoModalPage } from '../components/info-modal/info-modal.page';
import { PopoverController, ModalController, ToastController, AlertController } from '@ionic/angular';
import { FileService } from '../../services/file.service';
import { MapModalPage } from '../map-modal/map-modal.page'

@Component({
  selector: 'app-routes',
  templateUrl: './routes.page.html',
  styleUrls: ['./routes.page.scss'],
})
export class RoutesPage implements OnInit, AfterViewInit {

  constructor(
    private googleMap: GoogleMapsModule,
    private api: ApiService,
    private toaster: ToasterService,
    private Alerter: AlertService,
    public popoverController: PopoverController,
    private global: GlobalSettings,
    private modalCtrl: ModalController,
    private file: FileService,
    private alertCtrl: AlertController,

  ) { }

  ngAfterViewInit() {
    // this.global.get_Segments().subscribe(val => {
    //   this.Segments = val;
    // })

    this.get_segments()

    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }
      console.log(position);
    })
  }

  ngOnInit() {
    // this.global.get_parcel_filter_by().subscribe(async (value) => {
    //   this.filterBy = await value;
    // });
    // this.global.get_parcel_sort_by().subscribe(async (value) => {
    //   this.SortBy = await value;
    // });

    // this.get_segments();


  }

  zoom;
  center;
  options;

  public Segments: any = [];
  public results_count = 0;
  public searchText = '';
  public SortBy: String = '';
  public filterBy: String = '';
  public funnelBy: String = '';

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
   * get_segments
   */
  public get_segments() {

    let search = this.searchText;
    let SortBy = this.SortBy;
    let filterBy = this.filterBy;
    let funnelBy = this.funnelBy;

    this.api.get_all_segments(search, SortBy, filterBy, funnelBy).subscribe(res => {
      this.results_count = res.rows;
      this.Segments = res.data;
      console.log(res);
    })
  }

  /**
   * open_segment
   */
  public async open_segment(item) {
    const modal = await this.modalCtrl.create({
      component: MapModalPage,
      componentProps: {
        segment_id: item.id,
        snap_points: item.snap_points
      },
      cssClass: 'infoModalClass'
    })

    await modal.present();
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
            let data = this.Segments;
            this.file.exportAsCsvFile(data, 'Segments - ');
          }
        },
        {
          text: 'EXCEL',
          role: 'danger',
          handler: () => {
            this.file.exportAsExcelFile(this.Segments, 'Segments - ');
          }
        }
      ]
    })

    await alert.present();
  }

}
