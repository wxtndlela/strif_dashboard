import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AlertService } from '../../services/alert.service';
import { ToasterService } from '../../services/toaster.service';
import { PopoverController, ModalController, AlertController } from '@ionic/angular';
import { FilterComponent } from '../components/filter/filter.component';
import { GlobalSettings } from '../../services/global.service';
import { AddDocPage } from '../add-doc/add-doc.page'

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
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
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
  }

  public Docs: any = [];
  public results_count = 0;
  public searchText = '';
  public SortBy: String = '';
  public filterBy: String = '';
  public funnelBy: String = '';

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
    const modal = await this.modalCtrl.create({
      component: AddDocPage,
      cssClass: 'modalClass',
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
    const modal = await this.modalCtrl.create({
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
    await modal.onWillDismiss().then(res => {
      this.get_docs();
      console.log('popver dissmised:');
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
        {text: 'cancel'}
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
}
