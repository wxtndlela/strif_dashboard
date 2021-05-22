import { Component, OnInit } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps'
import { ApiService } from '../../services/api.service';
import { AlertService } from '../../services/alert.service';
import { ToasterService } from '../../services/toaster.service';
import { FilterComponent } from '../components/filter/filter.component';
import { GlobalSettings } from '../../services/global.service';
import { InfoModalPage } from '../components/info-modal/info-modal.page';
import { PopoverController, ModalController, ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.page.html',
  styleUrls: ['./routes.page.scss'],
})
export class RoutesPage implements OnInit {

  constructor(
    private googleMap: GoogleMapsModule,
    private api: ApiService,
    private toaster: ToasterService,
    private Alerter: AlertService,
    public popoverController: PopoverController,
    private global: GlobalSettings,
    private modalCtrl: ModalController,

  ) { }

  ngOnInit() {
    // this.global.get_parcel_filter_by().subscribe(async (value) => {
    //   this.filterBy = await value;
    // });
    // this.global.get_parcel_sort_by().subscribe(async (value) => {
    //   this.SortBy = await value;
    // });

    this.get_segments();

    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,

      }
      console.log(position);
    })
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
  public async open_segment(id) {
    const modal = await this.modalCtrl.create({
      component: InfoModalPage,
      componentProps: {
        'segment_id': id
      },
      cssClass: 'infoModalClass'
    })

    await modal.present();
  }

}
