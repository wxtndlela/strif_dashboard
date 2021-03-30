import { AlertController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
    private alertCtrl: AlertController,

  ) { }

  async presentWarnAlert(msg) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Lebo.M Courier',
      subHeader: 'Warning ⚠️',
      message: msg,
      buttons: ['OK']
    });
    
    await alert.present();
  }

  async presentDangerAlert(msg) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Lebo M. Curriers',
      subHeader: 'Danger ❌',
      message: msg,
      buttons: ['OK']
    });
    await alert.present();
  }

  async presentOtpAlert(msg) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Lebo M. Curriers',
      subHeader: 'Danger ❌',
      message: msg,
      buttons: [
        {
        text: 'OK',
        role: 'cancel',
      }
    ]
    });
    await alert.present();
  }
}