import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AlertService } from '../../services/alert.service';
import { ToasterService } from '../../services/toaster.service';
import { PopoverController, ModalController, PickerController, AlertController, LoadingController } from '@ionic/angular';
import { FilterComponent } from '../components/filter/filter.component';
import { GlobalSettings } from '../../services/global.service';
import { AddDocPage } from '../add-doc/add-doc.page'
import { FileService } from '../../services/file.service';
import * as moment from 'moment';
import { PickerOptions } from "@ionic/core";

@Component({
  selector: 'app-documents',
  templateUrl: './documents.page.html',
  styleUrls: ['./documents.page.scss'],
})

export class DocumentsPage implements OnInit {

  constructor(
    private api: ApiService,
    private toaster: ToasterService,
    private Alerter: AlertService,
    public popoverController: PopoverController,
    private global: GlobalSettings,
    private modalController: ModalController,
    private alertCtrl: AlertController,
    private file: FileService,
    private loadingCtrl: LoadingController,
    private pickerController: PickerController,

  ) { }

  ngOnInit() {
    this.global.get_doc_filter_by().subscribe(async (value) => {
      this.filterBy = await value;
      this.get_docs();
    });
    this.global.get_docs_sort_by().subscribe(async (value) => {
      this.SortBy = await value;
      this.get_docs();
    });
    this.global.get_docs_funnel_by().subscribe(async (value) => {
      this.funnelBy = await value;
      this.get_docs();
    });

    this.selected_minDate = this.minDate;
    this.selected_maxDate = this.maxDate;
  }

  public Docs: any = [];
  public results_count = 0;
  public searchText = '';
  public SortBy: String = '';
  public filterBy: String = '';
  public funnelBy: String = '';

  public minDate: String = moment("20160101", "YYYYMMDD").format().toString();
  public maxDate: String = moment().format().toString();

  public selected_minDate;
  public selected_maxDate;

  /**
 * get_doc
 */
  public get_docs() {
    let f: String = '';
    if (this.funnelBy == 'all') {
      f = '';
    }
    this.api.get_all_documents(this.searchText, this.SortBy, this.filterBy, f).subscribe(async res => {
      console.log(await res);
      this.results_count = res.rows;
      this.Docs = res.data;
    })
  }

  /**
   * add_new_doc
   */
  public async add_new_doc() {
    const modal = await this.modalController.create({
      component: AddDocPage,
    })

    modal.present();
    await modal.onWillDismiss().then(res => {
      this.get_docs();
      console.log('popver dissmised:');
    })

  }

  /**
 * edit_doc
 */
  public async edit_doc(doc_id, doc_title, doc_url, doc_type) {
    const modal = await this.modalController.create({
      component: AddDocPage,
      cssClass: 'modalClass',
      componentProps: {
        doc_id: doc_id,
        doc_title: doc_title,
        doc_url: doc_url,
        doc_type: doc_type
      }
    })

    modal.present();
    await modal.onWillDismiss().then(() => {
      this.get_docs();
    })

  }

  /**
  * del_document
  */
  public async del_document(doc_id, doc_title) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Delete Document ',
      message: doc_title,
      buttons: [
        {
          text: 'Delete',
          handler: (blah) => {
            console.log('delete doc');
          }
        },
        { text: 'cancel' }
      ]
    });

    await alert.present();
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

  public download_file(file, url) {
    this.file.download_file(url, file)
  }

  public async delete_doc(doc_id, title) {
    const alert = await this.alertCtrl.create({
      header: 'Delete document',
      message: 'Are you sure to delete Document ' + title + '  ?',
      buttons: [
        {
          text: 'Delete',
          role: 'danger',
          handler: () => {
            this.do_delete_doc(doc_id);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    })

    await alert.present();
  }

  /**
* do_delete_segment
*/
  public async do_delete_doc(doc_id) {
    const loading = await this.loadingCtrl.create({
      message: 'Deleting user ...'
    })

    await loading.present();
    this.api.remove_document(doc_id).subscribe(response => {
      loading.dismiss();
      console.log(response)
      if (response.status == 0) {
        this.toaster.successToast(response.msg);
        this.get_docs();
      } else {
        this.toaster.warnToast(response.msg);
      }
    })
  }

  public download_tmh() {

  }

  async showPicker() {
    let options: PickerOptions = {

      buttons: [
        {
          text: "Cancel",
          role: 'cancel'
        },
        {
          text: 'Ok',
          handler: (value: any) => {
            console.log('Date:', value)
            this.selected_maxDate = value.MaxDate.value;
            this.selected_minDate = value.MinDate.value;
          }
        }
      ],
      columns: [
        {
          name: 'MinDate',
          options: this.getMinDate(),
        },
        {
          name: 'MaxDate',
          options: this.getMaxDate()
        }
      ]
    };
    let picker = await this.pickerController.create(options);
    picker.present()
  }

  getMinDate() {
    let options = [];
    let minDate = Number(this.minDate.substr(0, 4));
    let maxDate = Number(this.maxDate.substr(0, 4));

    for (let x = minDate; x <= maxDate; x++) {
      options.push({ text: x, value: moment(`${x}0101`, "YYYYMMDD").format().toString() })
    }
    return options;
  }

  getMaxDate() {
    let options = [];
    let minDate = Number(this.minDate.substr(0, 4));
    let maxDate = Number(this.maxDate.substr(0, 4));

    for (let x = maxDate; x >= minDate; x--) {
      options.push({ text: x, value: moment(`${x}1231`, "YYYYMMDD").format().toString() })
    }
    return options;
  }

}
