import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AlertService } from '../../services/alert.service';
import { ToasterService} from '../../services/toaster.service';
import { PopoverController } from '@ionic/angular';
import { FilterComponent } from '../components/filter/filter.component';
import { GlobalSettings } from '../../services/global.service';

@Component({
  selector: 'app-parcels',
  templateUrl: './parcels.page.html',
  styleUrls: ['./parcels.page.scss'],
})

export class ParcelsPage implements OnInit {

  constructor(
    private api: ApiService,
    private toaster: ToasterService,
    private Alerter: AlertService,
    public popoverController: PopoverController,
    private global:GlobalSettings,
  ) { }

  ngOnInit() {
    this.global.get_parcel_filter_by().subscribe(async (value) => {
      this.filterBy = await value;
      this.get_Parcels();
    });
    this.global.get_parcel_sort_by().subscribe(async (value) => {
      this.SortBy = await value;
      this.get_Parcels();
    });
  }

  public Parcels: any  = [];
  public results_count = 0;
  public searchText = '';
  public SortBy : String = '';
  public filterBy : String = '';

  
  /**
   * get_Parcels
   */
  public get_Parcels() {
    this.api.get_all_parcels(this.searchText,this.SortBy,this.filterBy).subscribe(async res =>{
      console.log(await res);
      this.results_count = res.rows;
      this.Parcels = res.data;
    })
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

}
