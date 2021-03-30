import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiService } from '../services/api.service';
import { GlobalSettings } from '../services/global.service';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../services/alert.service';
import { NavController, LoadingController, ModalController } from "@ionic/angular";
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  template: 'The href is: {{href}}',
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {
  
  public appPages = [
    { title: 'Assesments', url: '/assesments', icon: 'map' },
    { title: 'Reports', url: '/routes', icon: 'walk' },
    { title: 'Surveys', url: '/surveys', icon: 'documents' },
    { title: 'Users', url: '/users', icon: 'people' },

  ];

  public userPages = [
    { title: 'Profile', url: '/profile', icon: 'id-card' },
    { title: 'Logout', url: '', icon: 'log-out' },
  ];

  constructor(
    private sanitizer: DomSanitizer,
    public global: GlobalSettings,
    private auth: AuthService,
    private fb: FormBuilder,
    private alert: AlertService,
    public loadingCtrl: LoadingController,
    private location: Location,
    private router: Router,
    private nav: NavController
  ) {
    //check if user is logged in
    this.isLoggedIn = this.auth.isLoggedin();
    if (location.path() == '/7093' && this.isLoggedIn == false) {
      this.route = location.path();
      this.isLogginIn = true;
      this.loginForm = this.fb.group({
        email: ['', Validators.required],
        password: ['', Validators.required]
      });
    } else {
      this.global.set_user_settings();
    } 
  }

  public show = false;
  public isLoggedIn: Boolean;
  public isLogginIn: Boolean = false;
  public loginForm: FormGroup;
  isSubmitted = false;
  route: string;

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
    this.nav.navigateRoot('/')
  }



  public async login() {
    let email = this.loginForm.get('email').value;
    let password = this.loginForm.get('password').value;
    const loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });

    this.isSubmitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    //check if user entered contact number or email
    if (!isNaN(Number(email))) {
      console.log('user entered a cellphone number');
      email = '+27' + String(email).substr(1, 9);
    }

    await loading.present();
    this.auth.login(email, password).subscribe(
      data => {
        if (data.status == 0) {
          this.auth.auth(data.data[0].uuid, data.data[0].user_role);
          this.isLoggedIn = true;
          this.isLogginIn = false;
          this.global.set_user_settings();
          console.log(data);
          loading.dismiss();
        } else {
          loading.dismiss();
          this.alert.presentWarnAlert(data.msg);
        }
      }, error => {
        loading.dismiss();
        //this.navCtrl.navigateForward(["client"]);
        console.log(error);
        this.alert.presentWarnAlert("Could not connect to server 🖥️, check your internet connection!");
      }
    )
  }

  /**
   * errorControl
   * 
   * get errors from form control
   */
  get errorControl() {
    return this.loginForm.controls;
  }
}
