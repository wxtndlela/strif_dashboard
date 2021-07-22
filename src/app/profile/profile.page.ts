import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, ModalController, LoadingController, AlertController } from "@ionic/angular";
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
    public global: GlobalSettings,
    private toaster: ToasterService,
    private firebase: FirebaseService,
    private alertCtrl: AlertController
  ) {
    this.profileForm = this.fb.group({
      email: ['', Validators.required],
      names: ['', Validators.required],
      surname: ['', Validators.required],
      gender: ['', Validators.required],
      contact: ['', Validators.required],
      municipality: ['', Validators.required],
      local_municipality: ['', Validators.required],
      province: ['', Validators.required],
      user_role: ['', Validators.required]
    });

    this.Province = (this.global.Province.value);

  }

  @Input('uuid') uuid: String;
  private user_id: any = '';
  public profileForm: FormGroup;
  isKeyboardHide = true;
  public day = moment().add(0, 'd').format().toString();
  public image: any = "../../../assets/avater-default.png";
  public Local_Municipality: any;
  public Municipality: any;
  public Province: any;

  isSubmitted = false;


  async ngOnInit() {
    if (this.uuid && this.uuid.length > 1) {
      this.user_id = this.uuid;
    } else {
      this.user_id = localStorage.getItem('uuid');
    }

    this.profileForm.get('province').valueChanges.subscribe(() => {
      let Province_name = this.profileForm.get('province');
      if(Province_name.value != ''){
        for (let index = 0; index < this.Province.length; index++) {
          const Province = this.Province[index];
          if(Province_name.value == Province.name){
            console.log('Province:', Province);
            this.Municipality = [];
            let District = Province.District;
            this.Municipality = District
            this.profileForm.get('municipality').setValue('');
          }
        }
      }
    })

    this.profileForm.get('municipality').valueChanges.subscribe(() => {
      let District_code = this.profileForm.get('municipality');
      if (District_code.value != '') {
        for (let index = 0; index < this.Municipality.length; index++) {
          const District = this.Municipality[index];
          if (District_code.value == District.code) {
            this.profileForm.get('local_municipality').setValue('');
            this.Local_Municipality = [];
            const Local_Municipality = District.Municipality;
            for (let index = 0; index < Local_Municipality.length; index++) {
              const element = Local_Municipality[index];
              this.Local_Municipality.push(element);
            }
            /*take a */ break;
          }
        }
      }
    })

    await this.getProfile();

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


  /**
 * errorControl
 * 
 * get errors from form control
 */
  get registerErrorControl() {
    return this.profileForm.controls;
  }

  public async getProfile() {
    const loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    await loading.present();

    // get user details from database
    this.api.get_user(this.user_id).subscribe(
      data => {
        if (data.status == 0) {
          console.log('User:', data)
          if (data.data[0].photourl) {
            this.image = data.data[0].photourl;
          }

          // this.profileForm.get('municipality').setValue(data.data[0].municipality);
          this.profileForm.get('email').setValue(data.data[0].email);
          this.profileForm.get('names').setValue(data.data[0].names);
          this.profileForm.get('surname').setValue(data.data[0].surname);
          this.profileForm.get('gender').setValue(data.data[0].gender);
          this.profileForm.get('contact').setValue(data.data[0].contact);
          this.profileForm.get('province').setValue(data.data[0].province);
          this.profileForm.get('user_role').setValue(data.data[0].user_role);

          let Province_name = this.profileForm.get('province');
          for (let index = 0; index < this.Province.length; index++) {
            const Province = this.Province[index];
            if (Province_name.value == Province.name) {
              console.log('Province:', Province);
              this.Municipality = [];
              let District = Province.District;
              this.Municipality = District
              this.profileForm.get('municipality').setValue(data.data[0].municipality);
            }
          }

          let District_code = this.profileForm.get('municipality');
          for (let index = 0; index < this.Municipality.length; index++) {
            const District = this.Municipality[index];
            if (District_code.value == District.code) {
              this.profileForm.get('local_municipality').setValue(data.data[0].local_municipality);
              this.Local_Municipality = [];
              const Local_Municipality = District.Municipality;
              for (let index = 0; index < Local_Municipality.length; index++) {
                const element = Local_Municipality[index];
                this.Local_Municipality.push(element);
              }
                /*take a */ break;
            }
          }


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
    let date_modified = this.day.substr(0, 10) + ' ' + this.day.substr(11, 8);
    let email = this.profileForm.get('email').value;
    let gender = this.profileForm.get('gender').value;
    let names = this.profileForm.get('names').value;
    let surname = this.profileForm.get('surname').value;
    let dateofbirth = null;
    let province = this.profileForm.get('province').value;
    let municipality = this.profileForm.get('municipality').value;
    let local_municipality = this.profileForm.get('local_municipality').value;
    let user_role = this.profileForm.get('user_role').value;

    const loading = await this.loadingCtrl.create({
      message: 'Updating ...'
    })

    await loading.present();

    this.api.update_user(this.user_id, contact, country, date_modified, email, gender[0], names, surname, dateofbirth, province, municipality, local_municipality, user_role)
      .subscribe(data => {
        loading.dismiss();
        if (data.status == 0) {
          this.toaster.successToast(data.msg);
          if (this.uuid && this.uuid.length > 1) {
            this.modalController.dismiss();
          } else {
            this.global.set_user_settings();
          }
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

  /**
   * delete_user
   */
  public async delete_user() {
    const alert = await this.alertCtrl.create({
      header: 'Delete user',
      message: 'Are you sure to delete Account  ?',
      buttons: [
        {
          text: 'Delete',
          role: 'danger',
          handler: () => {
            this.do_delete_user();
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
  public async do_delete_user() {
    const loading = await this.loadingCtrl.create({
      message: 'Deleting user ...'
    })

    await loading.present();
    this.api.remove_user(this.user_id).subscribe(response => {
      loading.dismiss();
      console.log(response)
      if (response.status == 0) {
        this.toaster.successToast(response.msg);
        if (this.uuid) {
          this.modalController.dismiss();
        }
      } else {
        this.toaster.warnToast(response.msg);
      }
    })
  }


  /**
   * dismiss
   */
  public dismiss() {
    this.modalController.dismiss();
  }

  private async get_all_local_municipality(municipality_id) {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    })

    loading.present();

    this.api.get_all_local_municipality(municipality_id).subscribe(res => {
      loading.dismiss();
      this.Local_Municipality = res.data;
    })


  }

  private async get_all_municipality(province) {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    })

    loading.present();

    this.api.get_all_municipality_by_province(province).subscribe(res => {
      loading.dismiss();
      this.Municipality = res.data;
    })
  }
}
