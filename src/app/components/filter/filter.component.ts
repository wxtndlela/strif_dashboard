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

  public docFilter = ['doc_title', 'modifiedondatetime', 'doc_type'];
  public docSort = ['DESC', 'ASC'];
  public funnelBy = ['all', 'help', 'safety', 'about'];

  public parcelSort = ['DESC', 'ASC'];
  public parcelFilter = ['addedondatetime', 'description', 'weight', 'destination_address'];

  public specialSort = ['DESC', 'ASC'];
  public specialFilter = ['addedondatetime', 'description', 'weight', 'destination_address'];

  public specialReqFilter = ['addedondatetime', 'description', 'weight', 'destination_address'];
  public specialReqSort = ['DESC', 'ASC'];

  public queryFilter = ['query', 'status', 'event_type'];
  public querySort = ['DESC', 'ASC'];

  public driverFilter = ['names', 'description', 'model', 'make'];
  public driverSort = ['DESC', 'ASC'];

  public list = [];

  ngOnInit() {
    this.init();
  }

  /**
   * setFilter
   */
  public setFilter(filter) {
    switch (this.event) {
      case 'userFilter':
        this.global.set_user_filter_by(filter);
        break;
      case 'userSort':
        this.global.set_user_sort_by(filter);
        break;
      case 'docFilter':
        this.global.set_doc_filter_by(filter);
        break;
      case 'docSort':
        this.global.set_docs_sort_by(filter);
        break;
      case 'funnelBy':
        this.global.set_docs_funnel_by(filter);
        break;
      case 'parcelFilter':
        this.global.set_parcel_filter_by(filter);
        break;
      case 'parcelSort':
        this.global.set_parcel_sort_by(filter);
        break;
      case 'specialReqFilter':
        this.global.set_special_filter_by(filter);
        break;
      case 'specialReqSort':
        this.global.set_special_sort_by(filter);
        break;
      case 'queryFilter':
        this.global.set_query_filter_by(filter);
        break;
      case 'querySort':
        this.global.set_query_sort_by(filter);
        break;
      case 'driverFilter':
        this.global.set_driver_filter_by(filter);
        break;
      case 'driverSort':
        this.global.set_driver_sort_by(filter);
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
      case 'userFilter':
        this.list = this.userFilter;
        break;
      case 'userSort':
        this.list = this.userSort;
        break;
      case 'docFilter':
        this.list = this.docFilter;
        break;
      case 'docSort':
        this.list = this.docSort;
        break;
      case 'docSort':
        this.list = this.docSort;
        break;
      case 'funnelBy':
        this.list = this.funnelBy;
        break;
      case 'parcelSort':
        this.list = this.parcelSort;
        break;
      case 'parcelFilter':
        this.list = this.parcelFilter;
        break;
      case 'specialReqFilter':
        this.list = this.specialReqFilter;
        break;
      case 'specialReqSort':
        this.list = this.specialReqSort;
        break;
      case 'queryFilter':
        this.list = this.queryFilter;
        break;
      case 'querySort':
        this.list = this.querySort;
        break;
      case 'driverFilter':
        this.list = this.queryFilter;
        break;
      case 'driverSort':
        this.list = this.driverSort;
        break;

      default:
        break;
    }
  }

}
