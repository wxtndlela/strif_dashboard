import { Component, OnInit } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps'
import { ApiService } from '../../services/api.service';
import { AlertService } from '../../services/alert.service';
import { ToasterService } from '../../services/toaster.service';
import { PopoverController, AlertController } from '@ionic/angular';
import { FilterComponent } from '../components/filter/filter.component';
import { GlobalSettings } from '../../services/global.service';
import { FileService } from '../../services/file.service';

@Component({
  selector: 'app-traffic',
  templateUrl: './traffic.page.html',
  styleUrls: ['./traffic.page.scss'],
})
export class TrafficPage implements OnInit {

  public Traffic: any = [];
  public results_count = 0;
  public searchText = '';
  public SortBy: any = '';
  public filterBy: any = '';
  public funnelBy: String = '';

  constructor(
    private googleMap: GoogleMapsModule,
    private api: ApiService,
    private toaster: ToasterService,
    private Alerter: AlertService,
    public popoverController: PopoverController,
    private global: GlobalSettings,
    private file: FileService,
    private alertCtrl: AlertController,


  ) { }

  ngOnInit() {

    this.global.get_traffic_filter_by().subscribe(async (value) => {

      if (this.filterBy != "") {
        this.get_traffic();
      }
      this.filterBy = value;

    });

    this.global.get_traffic_sort_by().subscribe(async (value) => {

      if (this.SortBy != "") {
        this.get_traffic();
      }
      this.SortBy = value;

    });

    this.get_traffic();

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
   * get_traffic
   */
  public get_traffic() {

    let search = this.searchText;
    let SortBy = this.SortBy;
    let filterBy = this.filterBy;
    let funnelBy = this.funnelBy;

    console.log('Sort by :', this.SortBy)

    this.api.get_all_traffic(search, SortBy, filterBy, funnelBy).subscribe(response => {
      this.results_count = response.rows;
      this.Traffic = response.data;
      console.log(response.data);
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
            let data = this.Traffic;
            this.file.exportAsCsvFile(data, 'Traffic - ' );
          }
        },
        {
          text: 'EXCEL',
          role: 'danger',
          handler: () => {
            this.file.exportAsExcelFile(this.Traffic, 'Traffic - ' );
          }
        }
      ]
    })

    await alert.present();
  }

}
