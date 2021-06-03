import { Component, OnInit, Input } from '@angular/core';
import { UsersPage } from '../../users/users.page';
import { GlobalSettings } from '../../../services/global.service';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})

export class FilterComponent implements OnInit {
  @Input('ev') event: String;

  constructor(
    private global: GlobalSettings,
    public popoverController: PopoverController,
  ) { }

  public userFilter = ['names', 'datecreated', 'email', 'contact', 'surname'];
  public userSort = ['DESC', 'ASC'];

  public trafficFilter = ['vehicle_type', 'direction'];
  public trafficSort = ['DESC', 'ASC'];

  public docFilter = ['doc_title', 'modifiedondatetime', 'doc_type'];
  public docSort = ['DESC', 'ASC'];
  public funnelBy = ['all', 'help', 'safety', 'about'];

  public assesMunicipality = ['all', 'Mbeki', 'model', 'make'];
  public assesFilter = ['Segments', 'Traffic', 'Bridges'];
  public assesReport = ['NV2021-03', 'description', 'model', 'make'];
  public MunicipalCoords = [
    { lat: -26.453575, lng: 29.196015 },
    { lat: -26.453575, lng: 29.196015 }
  ];
  public list = [];

  ngOnInit() {
    this.init();
  }

  /**
   * setFilter
   */
  public setFilter(filter) {
    switch (this.event) {
      case 'assesMunicipality':
        this.global.set_asses_municipality(filter);
        for (let x = 0; x < this.assesMunicipality.length; x++) {
          if (this.assesMunicipality == filter) {
            this.global.set_asses_MunicipalCoords(this.MunicipalCoords[x]);
          }
        }
        break;
      case 'assesFilter':
        this.global.set_asses_filter(filter);
        break;
      case 'assesReport':
        this.global.set_asses_report(filter);
        break;
      case 'trafficFilter':
        this.global.set_traffic_filter_by(filter);
        break;
      case 'trafficSort':
        this.global.set_traffic_sort_by(filter);
        break;

      default:
        break;
    }

    this.popoverController.dismiss();
  }

  /**
   * init
   */
  public init() {
    switch (this.event) {
      case 'assesMunicipality':
        this.list = this.assesMunicipality;
        break;
      case 'assesFilter':
        this.list = this.assesFilter;
        break;
      case 'assesReport':
        this.list = this.assesReport;
        break;
      case 'trafficFilter':
        this.list = this.trafficFilter;
        break;
      case 'trafficSort':
        this.list = this.trafficSort;
        break;


      default:
        break;
    }
  }

}
