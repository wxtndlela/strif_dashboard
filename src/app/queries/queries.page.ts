import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AlertService } from '../../services/alert.service';
import { ToasterService} from '../../services/toaster.service';
import { PopoverController, ModalController } from '@ionic/angular';
import { FilterComponent } from '../components/filter/filter.component';
import { GlobalSettings } from '../../services/global.service';
import { AddResponsePage } from '../add-response/add-response.page';

@Component({
  selector: 'app-queries',
  templateUrl: './queries.page.html',
  styleUrls: ['./queries.page.scss'],
})
export class QueriesPage implements OnInit {

  constructor(
    private api: ApiService,
    private toaster: ToasterService,
    private Alerter: AlertService,
    public popoverController: PopoverController,
    private global:GlobalSettings,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.global.get_query_filter_by().subscribe(async (value) => {
      this.filterBy = await value;
      this.get_query();
    });
    this.global.get_query_sort_by().subscribe(async (value) => {
      this.SortBy = await value;
      this.get_query();
    });
  }

  public Parcels: any  = [];
  public results_count = 0;
  public searchText = '';
  public SortBy : String = '';
  public filterBy : String = '';

  
  /**
   * getquery
   */
  public get_query() {
    this.api.get_all_query(this.searchText,this.SortBy,this.filterBy).subscribe(async res =>{
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

  /**
   * add_response
   */
  public async add_response(query_id, query, user_id) {
    const modal = await this.modalCtrl.create({
      component: AddResponsePage,
      cssClass: 'modalClass',
      componentProps: {
        query_id: query_id,
        query: query,
        user_id:user_id
      }
    })

    modal.present();
    await modal.onWillDismiss().then(res => {
      this.get_query();
    })
  }

}
