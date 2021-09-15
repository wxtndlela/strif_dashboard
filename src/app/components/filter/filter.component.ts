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
  public selected_item: any;
  public userFilter = ['names', 'datecreated', 'email', 'contact', 'surname'];
  public userSort = ['DESC', 'ASC'];

  public trafficFilter = ['vehicle_type', 'direction'];
  public trafficSort = ['DESC', 'ASC'];

  public docFilter = ['doc_title', 'modifiedondatetime', 'doc_type'];
  public docSort = ['DESC', 'ASC'];
  public funnelBy = ['all', 'help', 'safety', 'about'];

  public assesMunicipality = [
    {
      name: 'Gert Sibande District Municipality',
      latlng: { lat: -26.6021245, lng: 28.6379096 },
      borderline: '!4m5!3m4!1s0x1eeb8d69cec5c3e7:0x6f0a14c21c7465bd!8m2!3d-26.5470697!4d29.9740534'
    },
    {
      name: 'Chief Albert Luthuli Local Municipality',
      latlng: { lat: -26.1070426, lng: 30.1833867 }
    },
    {
      name: 'Dipaleseng Local Municipality',
      latlng: { lat: -26.7830363, lng: 28.3355219 }
    },
    {
      name: 'Govan Mbeki Local Municipality',
      latlng: { lat: -26.4526868, lng: 28.9158269 }
    },
    {
      name: 'Lekwa Local Municipality',
      latlng: { lat: -26.894726, lng: 29.068862 }
    },
    {
      name: 'Mkhondo Local Municipality',
      latlng: { lat: -26.926266, lng: 30.479057 }
    },
    {
      name: 'Msukaligwa Local Municipality',
      latlng: { lat: -26.5141548, lng: 30.0482557 }
    },
    {
      name: 'Pixley ka Isaka Seme Local Municipality',
      latlng: { lat: -27.1010457, lng: 29.7126971 }
    }
  ];

  public assesFilter = ['Assements', 'Segments', 'Traffic', 'Structures', 'Furniture'];
  public assesReport = ['NV2021-03', 'description', 'model', 'make'];
  public MunicipalCoords = [
    { lat: -26.453575, lng: 29.196015 },
    { lat: -26.453575, lng: 29.196015 }
  ];
  public list = [];

  constructor(
    private global: GlobalSettings,
    public popoverController: PopoverController,
  ) { }

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
          if (this.selected_item == filter) {
            this.global.set_asses_MunicipalCoords(this.assesMunicipality[x].latlng);
            this.global.set_munic_Borderline('!4m5!3m4!1s0x1eeb8d69cec5c3e7:0x6f0a14c21c7465bd!8m2!3d-26.5470697!4d29.9740534');
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
      case 'userFilter':
        this.global.set_user_filter_by(filter);
        break;
      case 'userSort':
        this.global.set_user_sort_by(filter);
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
        this.selected_item = this.global.asses_municipality.value;
        let municipality: string[] = [];
        for (let index = 0; index < this.assesMunicipality.length; index++) {
          municipality.push(this.assesMunicipality[index].name)
        }
        this.list = municipality;
        break;
      case 'assesFilter':
        this.selected_item = this.global.asses_filter.value;
        this.list = this.assesFilter;
        break;
      case 'assesReport':
        this.selected_item = this.global.asses_report.value;
        this.list = this.assesReport;
        break;
      case 'trafficFilter':
        this.selected_item = this.global.traffic_filter_by.value;
        this.list = this.trafficFilter;
        break;
      case 'trafficSort':
        this.selected_item = this.global.traffic_sort_by.value;
        this.list = this.trafficSort;
        break;
      case 'userFilter':
        this.selected_item = this.global.user_filter_by.value;
        this.list = this.userFilter;
        break;
      case 'userSort':
        this.selected_item = this.global.user_sort_by.value;
        this.list = this.userSort;
        break;
      default:
        break;
    }
  }

}
