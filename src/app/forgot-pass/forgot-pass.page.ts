import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { NavController, LoadingController, ModalController } from "@ionic/angular";

@Component({
  selector: 'app-forgot-pass',
  templateUrl: './forgot-pass.page.html',
  styleUrls: ['./forgot-pass.page.scss'],
})
export class ForgotPassPage implements OnInit {

  constructor(
    private fb: FormBuilder,
    private modal: ModalController,
    private api: ApiService,
    public loadingCtrl: LoadingController,
  ) {
    this.resetPassForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    });
  }

  @Input('email') email: String;
  public resetPassForm: FormGroup;
  isSubmitted = false;

  ngOnInit() {
    this.resetPassForm.setValue({
      'email': this.email
    })
  }

  /**
  * errorControl
  * 
  * get errors from form control
  */
  get errorControl() {
    return this.resetPassForm.controls;
  }

  /**
  * submit
  */
  public async submit() {
    const loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });

    this.isSubmitted = true;
    if (this.resetPassForm.invalid) {
      return;
    }

    let email = this.resetPassForm.get('email').value;

    this.api.resetPassword(email).subscribe(res => {
      console.log(res);
    })
    
  }
}
