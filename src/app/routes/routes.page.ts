import { Component, OnInit } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps'
import { ApiService } from '../../services/api.service';
import { AlertService } from '../../services/alert.service';
import { ToasterService} from '../../services/toaster.service';
import { PopoverController } from '@ionic/angular';
import { FilterComponent } from '../components/filter/filter.component';
import { GlobalSettings } from '../../services/global.service';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.page.html',
  styleUrls: ['./routes.page.scss'],
})
export class RoutesPage implements OnInit {

  constructor(
    private googleMap : GoogleMapsModule,
    private api: ApiService,
    private toaster: ToasterService,
    private Alerter: AlertService,
    public popoverController: PopoverController,
    private global:GlobalSettings,
  ) { }

  ngOnInit() {
    this.global.get_parcel_filter_by().subscribe(async (value) => {
      this.filterBy = await value;
    });
    this.global.get_parcel_sort_by().subscribe(async (value) => {
      this.SortBy = await value;
    });

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

  public Parcels: any  = [];
  public results_count = 0;
  public searchText = '';
  public SortBy : String = '';
  public filterBy : String = '';

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

}
