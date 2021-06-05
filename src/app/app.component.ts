import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiService } from '../services/api.service';
import { GlobalSettings } from '../services/global.service';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../services/alert.service';
import { ForgotPassPage } from './forgot-pass/forgot-pass.page';
import { NavController, LoadingController, ModalController, MenuController, Platform } from "@ionic/angular";
import { ToasterService } from '../services/toaster.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import * as moment from 'moment';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  template: 'The href is: {{href}}',
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})

export class AppComponent {

  public appPages = [
    { title: 'Assessment', url: '/assesments', icon: 'map' },
    { title: 'Segments', url: '/routes', icon: 'walk' },
    { title: 'Traffic', url: '/traffic', icon: 'car' },
    { title: 'Documents', url: '/documents', icon: 'documents' },
    { title: 'Users', url: '/users', icon: 'people' },
  ];

  public selected_appPage = 'Assessment';

  public userPages = [
    { title: 'Profile', url: '/profile', icon: 'id-card' },
    { title: 'Logout', url: '', icon: 'log-out' },
  ];

  public isMobile: any = false;

  constructor(
    private sanitizer: DomSanitizer,
    public global: GlobalSettings,
    private auth: AuthService,
    private fb: FormBuilder,
    private alert: AlertService,
    public loadingCtrl: LoadingController,
    private location: Location,
    private router: Router,
    private nav: NavController,
    private api: ApiService,
    private modal: ModalController,
    private toaster: ToasterService,
    private menu: MenuController,
    private platform: Platform,
    private statusBar: StatusBar
  ) {
    //check if user is logged in
    this.isLoggedIn = this.auth.isLoggedin();
    if (location.path() == '/login' && this.isLoggedIn == false) {
      this.route = location.path();
      this.isLogginIn = true;

    } else if (location.path() == '/register' && this.isLoggedIn == false) {
      this.route = location.path();
      this.isRegistering = true;

    } else {
      this.global.set_user_settings();
    }

    this.platform.ready().then(() => {
      this.set_layout(platform.width());
      platform.resize.subscribe(() => {
        console.log('size:', platform.width())
        this.set_layout(platform.width());
      })

      // set status bar to white
      this.statusBar.backgroundColorByHexString('#F27405');
    });

    this.global.get_isMobile().subscribe(async (value) => {
      this.isMobile = value;
    })

    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      password: ['', [Validators.required, Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")]],
      names: ['', [Validators.required, Validators.pattern("^[a-zA-Z- ]*$")]],
      surname: ['', [Validators.required, Validators.pattern("^[a-zA-Z- ]*$")]],
    });

  }

  public show = false;
  public isLoggedIn: Boolean;
  public isLogginIn: Boolean = false;
  public isRegistering: Boolean = false;
  public loginForm: FormGroup;
  public registerForm: FormGroup;
  isSubmitted = false;
  route: string;
  public day = moment().add(0, 'd').format().toString();
  slideOpts = {
    initialSlide: 1,
    speed: 400,
    autoplay: {
      delay: 5000,
    }
  };

  public show_hide() {
    this.show = !this.show;
  }

  /**
   * logout
   */
  public logout() {
    this.auth.logout();
    this.isLoggedIn = false;
  }

  /**
   * go_home
   */
  public go_home() {
    this.isLogginIn = false;
    this.isRegistering = false;
    this.nav.navigateRoot('/')
  }

  /**
   * goto_login
   */
  public goto_login() {
    this.isLogginIn = true;
    this.isRegistering = false;
    this.nav.navigateRoot('/login')
  }

  /**
   * goto_register
   */
  public goto_register() {
    this.isLogginIn = false;
    this.isRegistering = true;
    this.nav.navigateRoot('/register')
  }

  public async login() {

    const loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });

    this.isSubmitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    let email = this.loginForm.get('email').value;
    let password = this.loginForm.get('password').value;

    //check if user entered contact number or email
    if (!isNaN(Number(email))) {
      console.log('user entered a cellphone number');
      email = '+27' + String(email).substr(1, 9);
    }

    await loading.present();
    this.auth.login(email, password).subscribe(
      data => {
        if (data.status == 0) {

          if (data.data[0].user_role != '') {
            this.auth.auth(data.data[0].uuid, data.data[0].user_role);
            this.isLoggedIn = true;
            this.isLogginIn = false;
            this.global.set_user_settings();
          } else {
            this.toaster.warnToast('This Account is not yet verified, contact admin!')
          }


          console.log(data);
          loading.dismiss();
        } else {
          loading.dismiss();
          console.log(data);
          this.alert.presentWarnAlert(data.msg);
        }
      }, error => {
        loading.dismiss();
        console.log(error);
        this.alert.presentWarnAlert("Could not connect to server 🖥️, check your internet connection!");
      }
    )
  }

  public async register() {


    const loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });

    this.isSubmitted = true;
    if (this.registerForm.invalid) {
      return;
    }

    let user_role = 'admin';
    let password = this.registerForm.get('password').value;
    let date_created = this.day.substr(0, 10) + ' ' + this.day.substr(11, 11);
    let date_modified = this.day.substr(0, 10) + ' ' + this.day.substr(11, 11);
    let email = this.registerForm.get('email').value;
    let contact = '';
    let country = 'South Africa';
    let province = 'Mpumalanga Province';
    let names = this.registerForm.get('names').value;
    let surname = this.registerForm.get('surname').value;
    let username = String(this.registerForm.get('names').value).split(' ')[0] + this.registerForm.get('surname').value;
    let photo_url = "";
    let gender = 'rather not say';
    let dateofbirth = '';
    let last_login = 'last_login';
    let municipality = '';
    let local_municipality = '';
    console.log(date_created);


    await loading.present();
    this.api.add_user(user_role, password, date_created, date_modified, email, contact, country, province, municipality, local_municipality, names, surname, username, photo_url, gender, dateofbirth, last_login).subscribe(
      data => {
        if (data.status == 0) {
          console.log(data);
          loading.dismiss();
          this.toaster.successToast(data.msg);
        } else {
          loading.dismiss();
          this.alert.presentWarnAlert(data.msg);
        }
      }, error => {
        loading.dismiss();
        console.log(error);
        this.alert.presentWarnAlert("Could not connect to server 🖥️, check your internet connection!");
      }
    )
  }

  /**
   * forgot_pass
   */
  public async forgot_pass() {
    const modal = await this.modal.create({
      component: ForgotPassPage,
      cssClass: 'smallmodalClass',
      componentProps: {
        'email': this.loginForm.get('email').value
      }
    })

    return modal.present();
  }

  /**
   * errorControl
   * 
   * get errors from form control
   */
  get loginErrorControl() {
    return this.loginForm.controls;
  }
  get registerErrorControl() {
    return this.registerForm.controls;
  }

  /**
   * open_menu
   */
  public async open_menu() {
    this.menu.enable(true, 'menu');
    this.menu.open('menu');
  }

  /**
   * select_page
   */
  public select_page(page) {
    this.selected_appPage = page;
  }

  /**
   * set_layout
   */
  public set_layout(width: any) {

    if (width <= 992) {
      this.global.set_isMobile(true);
    } else {
      this.global.set_isMobile(false);
    }

  }

  /**
   * open_hint
   */
  public open_hint() {

  }


}
