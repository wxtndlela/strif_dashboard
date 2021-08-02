import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddStructurePage } from '../../add-structure/add-structure.page';
import { AddFurniturePage } from '../../add-furniture/add-furniture.page';
import { AddSegmentPage } from '../../add-segment/add-segment.page';
import { GlobalSettings } from '../../../services/global.service';
import { PopoverController } from '@ionic/angular';


@Component({
  selector: 'app-add-options',
  templateUrl: './add-options.component.html',
  styleUrls: ['./add-options.component.scss'],
})
export class AddOptionsComponent implements OnInit {

  constructor(
    private modalController: ModalController,
    private global: GlobalSettings,
    private popoverController: PopoverController
  ) { }

  ngOnInit() { }

  /**
   * add_new
   */
  public async add_new(type: String) {

    let modal = await this.modalController.create({
      component: AddStructurePage,
      cssClass: 'infoModalClass'
    })

    switch (type) {
      case 'furniture':
        modal.component = AddFurniturePage;
        modal.present();
        break;
      case 'segment':
        this.global.set_isDrawing(true);
        this.popoverController.dismiss();
        break;
      case 'structure':
        modal.component = AddStructurePage;
        modal.present();
        break;

      default:
        break;
    }



  }

}
