import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../../services/alert.service';
import { NavController, LoadingController, ModalController, Platform } from "@ionic/angular";
import { ToasterService } from '../../services/toaster.service';
import * as moment from 'moment';
import { GlobalSettings } from '../../services/global.service';


@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.page.html',
  styleUrls: ['./add-user.page.scss'],
})
export class AddUserPage implements OnInit {

  constructor(
    private fb: FormBuilder,
    private alert: AlertService,
    public loadingCtrl: LoadingController,
    private nav: NavController,
    private api: ApiService,
    private modalCtrl: ModalController,
    private toaster: ToasterService,
    private global: GlobalSettings,
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      password: ['', [Validators.required, Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")]],

      names: ['', [Validators.required, Validators.pattern("^[a-zA-Z- ]*$")]],
      surname: ['', [Validators.required, Validators.pattern("^[a-zA-Z- ]*$")]],
      contact: ['', [Validators.required, Validators.pattern(/0((60[3-9]|64[0-5]|66[0-5])\d{6}|(7[1-4689]|6[1-3]|8[1-4])\d{7})/g)]],
      user_role: ['', [Validators.required]],
      municipality: ['', [Validators.required]],
      local_municipality: ['', [Validators.required]],

      province: ['', [Validators.required]],
      gender: ['', [Validators.required]],
    });

    this.Province = (this.global.Province.value);

  }

  public Province: any;
  public registerForm: FormGroup;
  isSubmitted = false;
  public day = moment().format('yyyy-MM-DD H:mm:ss-00').toString();
  public Municipality: any;
  public Local_Municipality: any;
  public selected_municipality: any;

  ngOnInit() {

    this.registerForm.get('province').valueChanges.subscribe(() => {
      let Province_name = this.registerForm.get('province');
      if(Province_name.value != ''){
        for (let index = 0; index < this.Province.length; index++) {
          const Province = this.Province[index];
          if(Province_name.value == Province.name){
            console.log('Province:', Province);
            this.Municipality = [];
            let District = Province.District;
            this.Municipality = District
            this.registerForm.get('municipality').setValue('');
          }
        }
      }
    })

    this.registerForm.get('municipality').valueChanges.subscribe(() => {
      let District_code = this.registerForm.get('municipality');
      if (District_code.value != '') {
        for (let index = 0; index < this.Municipality.length; index++) {
          const District = this.Municipality[index];
          if (District_code.value == District.code) {
            this.registerForm.get('local_municipality').setValue('');
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

  }

  private async get_all_local_municipality(municipality_id) {
    const loading = await this.loadingCtrl.create({
      message: 'getting local municipalities ...'
    })

    loading.present();

    this.api.get_all_local_municipality(municipality_id).subscribe(res => {
      loading.dismiss();
      this.Local_Municipality = res.data;
    })
  }

  private async get_all_municipality(province) {
    const loading = await this.loadingCtrl.create({
      message: 'getting district municipalities ...'
    })

    loading.present();

    this.api.get_all_municipality_by_province(province).subscribe(res => {
      loading.dismiss();
      this.Municipality = res.data;
    })
  }


  /**
 * errorControl
 * 
 * get errors from form control
 */
  get registerErrorControl() {
    return this.registerForm.controls;
  }

  /**
   * do_add_user
   */
  public async do_add_user() {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait ...'
    })

    this.isSubmitted = true;

    console.log(this.registerForm.get('contact').errors)
    if (this.registerForm.invalid) {
      console.log(this.registerForm.invalid)
      return;
    }

    loading.present();

    let user_role = this.registerForm.get('user_role').value;
    let password = this.registerForm.get('password').value;
    let date_created = this.day;
    let date_modified = this.day;
    let email = this.registerForm.get('email').value;
    let contact = this.registerForm.get('contact').value;
    let country = 'South Africa';
    let province = this.registerForm.get('province').value;
    let municipality = this.registerForm.get('municipality').value;
    let local_municipality = this.registerForm.get('local_municipality').value;
    let names = this.registerForm.get('names').value;
    let surname = this.registerForm.get('surname').value;
    let username = String(names).split(' ')[0] + surname;
    let photo_url = '';
    let gender = this.registerForm.get('gender').value;
    let dateofbirth = '';
    let last_login = this.day;

    this.api.add_user(user_role, password, date_created, date_modified, email, contact, country, province, municipality, local_municipality, names, surname, username, photo_url, gender, dateofbirth, last_login).subscribe(res => {
      loading.dismiss();
      if (res.status == 0) {
        this.toaster.successToast(res.msg);
        console.log(res)
        this.modalCtrl.dismiss()
      } else {
        this.alert.presentWarnAlert(res.msg)
      }
    })

  }

}
