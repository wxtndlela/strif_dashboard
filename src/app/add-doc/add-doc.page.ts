import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ToasterService } from '../../services/toaster.service';
import { AlertService } from '../../services/alert.service';
import { ModalController } from "@ionic/angular";
import { FirebaseService } from '../../services/firebase.service';
import * as moment from 'moment';

@Component({
  selector: 'app-add-doc',
  templateUrl: './add-doc.page.html',
  styleUrls: ['./add-doc.page.scss'],
})
export class AddDocPage implements OnInit {

  //passed parameters for existing document to be
  @Input('doc_id') doc_id: String;
  @Input('doc_title') doc_title: String;
  @Input('doc_url') doc_url: String;
  @Input('doc_type') doc_type: String;

  constructor(
    private fb: FormBuilder,
    private apis: ApiService,
    private modalCtrl: ModalController,
    private firebase: FirebaseService,
    private toaster: ToasterService,
    private alerter: AlertService
  ) {
    this.addDocForm = this.fb.group({
      title: ['', Validators.required],
      type: ['', Validators.required],
      body: ['', Validators.required],
    });
  }

  addDocForm: FormGroup;
  Types = ['help', 'safety', 'about'];
  isLoading = false;
  isSubmitted = false;
  public day = moment().add(0, 'd').format().toString();

  ngOnInit() {
    this.addDocForm.setValue({
      title: this.doc_title,
      type: this.doc_type,
      body: this.doc_url
    })
  }

  /**
   * submit
   */
  public submit() {
    this.isSubmitted = true;
    if (this.addDocForm.invalid) {
      console.log('invalid form');
      return
    }
    this.makeTextFile()
    this.isLoading = true;
  }

  /**
   * makeTextFile
   */
  public makeTextFile() {
    var data = 'data:text/plain;base64,' + btoa(this.addDocForm.get('body').value);
    this.upload_doc(data);
  }

  /**
   * upload_doc
   */
  public upload_doc(data) {
    let docURI = data;
    let doc_id = this.addDocForm.get('title').value;
    let doc_title = this.addDocForm.get('title').value;
    let doc_type = this.addDocForm.get('type').value;
    let modifiedondatetime = this.day.substr(0, 10) + ' ' + this.day.substr(11, 8)
    let doc_url = this.addDocForm.get('body').value;
    let sys_user_id = localStorage.getItem('uuid');
    let addedondatetime = this.day.substr(0, 10) + ' ' + this.day.substr(11, 8);
    let doc_body = this.addDocForm.get('body').value;

    if (this.doc_id) {
      console.log('edit mode');
      this.apis.update_document(this.doc_id, doc_title, doc_type, doc_url, modifiedondatetime)
        .subscribe(res => {
          this.isLoading = false;
          if (res.status == 0) {
            this.toaster.successToast(res.msg);
          } else {
            this.alerter.presentDangerAlert(res.msg);
          }
        })
    } else {
      console.log('add mode');
      this.apis.add_new_document(doc_title, doc_type, modifiedondatetime, doc_url, doc_body, sys_user_id, addedondatetime)
        .subscribe(res => {
          this.isLoading = false;
          if (res.status == 0) {
            this.toaster.successToast(res.msg);
          } else {
            this.alerter.presentDangerAlert(res.msg);
          }
        })
    }

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
    return this.addDocForm.controls;
  }

}
