import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, ModalController, LoadingController } from "@ionic/angular";
import { ChangePassPage } from '../change-pass/change-pass.page';
import { AlertService } from '../../services/alert.service';
import { ApiService } from '../../services/api.service';
import { GlobalSettings } from '../../services/global.service';
import { ToasterService } from '../../services/toaster.service';
import { FirebaseService } from '../../services/firebase.service';
import * as moment from 'moment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(
    private navCtrl: NavController,
    private fb: FormBuilder,
    public modalController: ModalController,
    public loadingCtrl: LoadingController,
    private alert: AlertService,
    private api: ApiService,
    public global : GlobalSettings,
    private toaster: ToasterService,
    private firebase: FirebaseService,

  ) {
    this.profileForm = this.fb.group({
      email: ['', Validators.required],
      names: ['', Validators.required],
      surname: ['', Validators.required],
      gender: ['', Validators.required],
      contact: ['', Validators.required]
    });
  }

  public profileForm: FormGroup;
  isKeyboardHide = true;
  public day = moment().add(0, 'd').format().toString();
  public image: any = "../../../assets/avater-default.png";

  ngOnInit() {
    this.getProfile();
  }

  ionViewWillEnter() {
  }

  /**
 * add_photo
 */
  public add_photo() {
    // const options: CameraOptions = {
    //   quality: 50,
    //   destinationType: this.camera.DestinationType.DATA_URL,
    //   encodingType: this.camera.EncodingType.JPEG,
    //   mediaType: this.camera.MediaType.PICTURE,
    //   cameraDirection: 0,
    //   correctOrientation: true,
    // }
    // //take picture first
    // this.camera.getPicture(options).then((imageData) => {
    //   // imageData is either a base64 encoded string or a file URI
    //   // If it's base64 (DATA_URL):
    //   let base64Image = 'data:image/jpeg;base64,' + imageData;
    //   this.image = base64Image;
    //   //upload here
    //   this.upload_picture()
    // }, (err) => {
    //   // Handle error
    //   this.alert.presentWarnAlert(err);
    // });
  }


  public async getProfile() {
    const loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    await loading.present();

    // get user details from database
    this.api.get_user().subscribe(
      data => {
        if (data.status == 0) {
          if(data.data[0].photourl){
            this.image = data.data[0].photourl;
          }
          this.profileForm.setValue({
            'email': data.data[0].email,
            'names': data.data[0].names,
            'surname': data.data[0].surname,
            'gender': data.data[0].gender,
            'contact': data.data[0].contact,
          });
          loading.dismiss();
        } else {
          loading.dismiss();
          this.alert.presentWarnAlert(data.msg);
        }
      }, error => {
        loading.dismiss();
        this.alert.presentWarnAlert("Could not connect to server 🖥️, check your internet connection!");
      }
    )
  }

  //return to previous page
  public goBack() {
    this.navCtrl.pop();
  }

  //open change password modal
  public async openChangePass() {
    const modal = await this.modalController.create({
      component: ChangePassPage,
      cssClass: 'modal-class'
    });
    return await modal.present();
  }

  //open chacge cellphone modal
  public async openChangeCell() {
    // const modal = await this.modalController.create({
    //   component: ChangeCellPage,
    //   cssClass: 'modal-class'
    // });
    // return await modal.present();
  }

  //update profile
  public async updateProfile() {
    let contact = this.profileForm.get('contact').value;
    let country = 'South Africa';
    let modifiedondatetime = this.day.substr(0, 10) + ' ' + this.day.substr(11, 8);
    let email = this.profileForm.get('email').value;
    let gender = this.profileForm.get('gender').value;
    let names = this.profileForm.get('names').value;
    let surname = this.profileForm.get('surname').value;
    let dateofbirth = null;

    const loading = await this.loadingCtrl.create({
      message: 'Updating ...'
    })

    await loading.present();

    this.api.update_user(contact, country, modifiedondatetime, email, gender[0], names, surname, dateofbirth)
      .subscribe(data => {
        loading.dismiss();
        if (data.status == 0) {
          this.toaster.successToast(data.msg);
          this.global.set_user_settings();
        } else {
          this.alert.presentWarnAlert(data.msg);
        }
      }, error => {
        loading.dismiss();
        this.alert.presentWarnAlert("Could not connect to server 🖥️, check your internet connection!");
      })
  }

  public async upload_picture() {
    const loading = await this.loadingCtrl.create({
      message: 'uploading image...'
    })

    loading.present();

    this.firebase.uploadImage(this.image).then(res => {
      loading.dismiss();
      this.api.update_user_photo(res).subscribe(data => {
      })
    }).catch(error => {
      loading.dismiss();
      this.alert.presentWarnAlert("Could not connect to server 🖥️, check your internet connection!");
    })
  }

  //dissmiss modal
  public dismissModal() {
    this.modalController.dismiss();
  }

}
