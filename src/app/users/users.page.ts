import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AlertService } from '../../services/alert.service';
import { ToasterService } from '../../services/toaster.service';
import { PopoverController, ModalController } from '@ionic/angular';
import { FilterComponent } from '../components/filter/filter.component';
import { GlobalSettings } from '../../services/global.service';
import { AddUserPage } from '../add-user/add-user.page';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {

  constructor(
    private api: ApiService,
    private toaster: ToasterService,
    private Alerter: AlertService,
    public popoverController: PopoverController,
    private global: GlobalSettings,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.global.get_user_filter_by().subscribe(async (value) => {
      this.filterBy = await value;
      this.get_users();
    });
    this.global.get_user_sort_by().subscribe(async (value) => {
      this.SortBy = await value;
      this.get_users();
    });

  }



  public Users: any = [];
  public results_count = 0;
  public searchText = '';
  public SortBy: String = '';
  public filterBy: String = '';

  /**
   * get_users
   */
  public get_users() {
    this.api.get_all_user(this.searchText, this.SortBy, this.filterBy).subscribe(async res => {
      this.results_count = res.rows;
      this.Users = res.data;
      console.log(res)
    })
  }

  async presentPopover(ev: any, event) {
    String(event).substr
    const popover = await this.popoverController.create({
      component: FilterComponent,
      cssClass: 'popoverclass',
      event: ev,
      translucent: true,
      componentProps: {
        event: event
      },
    });
    return await popover.present();
  }

  /**
   * add_user
   */
  public async add_user() {
    const modal = await this.modalCtrl.create({
      component: AddUserPage,
    })

    modal.present();

    modal.onWillDismiss().then(()=>{
      this.get_users();
    })
  }



}
