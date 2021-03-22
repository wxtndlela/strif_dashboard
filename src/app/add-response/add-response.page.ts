import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ToasterService } from '../../services/toaster.service';
import { AlertService } from '../../services/alert.service';
import { ModalController } from "@ionic/angular";
import { FirebaseService } from '../../services/firebase.service';
import * as moment from 'moment';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-add-response',
  templateUrl: './add-response.page.html',
  styleUrls: ['./add-response.page.scss'],
})
export class AddResponsePage implements OnInit {

  //passed parameters for existing queryument to be
  @Input('query_id') query_id: String;
  @Input('query') query: String;
  @Input('user_id') user_id: String;


  constructor(
    private fb: FormBuilder,
    private apis: ApiService,
    private modalCtrl: ModalController,
    private firebase: FirebaseService,
    private toaster: ToasterService,
    private alerter: AlertService,
    private sanitizer: DomSanitizer,

  ) {
    this.addResponseForm = this.fb.group({
      response: ['', Validators.required],
    });
  }

  addResponseForm: FormGroup;
  Types = ['help', 'safety', 'about'];
  isLoading = false;
  isSubmitted = false;
  public day = moment().add(0, 'd').format().toString();

  ngOnInit() {
    this.addResponseForm.setValue({
      response: "Hey there <p>This is a reponse in light of your recent query to us by you. <br> <br> Query : "+this.query+" <br> <br> Response: write response here ........<p/> <p>kind Regards<br><p> Lebo .M Courier <br> <img style='height:60px;background-color: #222;' src='http://www.lebomcourier.co.za/wp-content/uploads/2019/04/lebom-logo.png'/> "
    })
  }

  /**
   * submit
   */
  public submit() {
    this.isSubmitted = true;
    if (this.addResponseForm.invalid) {
      console.log('invalid form');
      return
    }
    
    this.isLoading = true;

    console.log(this.user_id)
    this.apis.update_response(this.query, this.addResponseForm.get('response').value, '0', this.query_id, this.user_id).subscribe(res =>{
      this.isLoading = false;
      if(res.status == 0){
        this.toaster.successToast(res.msg);
        this.modalCtrl.dismiss();
      }else{
      this.alerter.presentWarnAlert(res.msg)
      }
    })
  }


  

  /**
   * cancel
   */
  public cancel() {
    this.modalCtrl.dismiss();
  }

  /**
   * errorControl
   * 
   * get errors from form control
   */
  get errorControl() {
    return this.addResponseForm.controls;
  }

}
