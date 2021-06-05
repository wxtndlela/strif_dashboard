import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ToasterService } from '../../services/toaster.service';
import { AlertService } from '../../services/alert.service';
import { ModalController, LoadingController } from "@ionic/angular";
import { FirebaseService } from '../../services/firebase.service';
import * as moment from 'moment';
import { FileService } from '../../services/file.service';

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
    private api: ApiService,
    private modalCtrl: ModalController,
    private firebase: FirebaseService,
    private toaster: ToasterService,
    private alerter: AlertService,
    private file: FileService,
    private loadingCtrl: LoadingController
  ) {
    this.addDocForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      file: ['', Validators.required],
    });
  }

  addDocForm: FormGroup;
  Types = ['help', 'safety', 'about'];
  isLoading = false;
  isSubmitted = false;
  public day = moment().format().toString();
  base64Data: any;
  filename: any;
  filePath: any;
  fileSize: any;

  ngOnInit() {

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
      // this.apis.update_document(this.doc_id, doc_title, doc_type, doc_url, modifiedondatetime)
      //   .subscribe(res => {
      //     this.isLoading = false;
      //     if (res.status == 0) {
      //       this.toaster.successToast(res.msg);
      //     } else {
      //       this.alerter.presentDangerAlert(res.msg);
      //     }
      //   })
    } else {
      console.log('add mode');
      // this.apis.add_new_document(doc_title, doc_type, modifiedondatetime, doc_url, doc_body, sys_user_id, addedondatetime)
      //   .subscribe(res => {
      //     this.isLoading = false;
      //     if (res.status == 0) {
      //       this.toaster.successToast(res.msg);
      //     } else {
      //       this.alerter.presentDangerAlert(res.msg);
      //     }
      //   })
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

  /**
   * add_doc
   */
  public async add_doc() {
    this.isSubmitted = true;
    if (this.addDocForm.invalid) {
      return
    }

    let file = this.addDocForm.get('file').value;

    let title = this.addDocForm.get('title').value;
    let description = this.addDocForm.get('description').value;
    let base64Data = this.base64Data;
    let file_size = this.fileSize;
    let file_extention = String(file).split('.')[1];
    let District = 1;
    let user_id = localStorage.getItem('uuid');
    let date_created = moment().format('YYYY-MM-DD hh:mm:ss');
    let filename = `${title}.${file_extention}`;
    title = filename;

    const loading = await this.loadingCtrl.create({
      message: 'please wait ...'
    })

    loading.present();
    this.api.add_document(title, description, base64Data, file_size, file_extention, District, user_id, date_created, filename).subscribe(res => {
      loading.dismiss();
      this.modalCtrl.dismiss();
      console.log(res)
    })
  }

  uploadFile(event) {

    const file = event.target.files[0];
    const reader = new FileReader();

    this.filename = event.target.files[0].name;
    this.fileSize = Math.round(event.target.files[0].size / 1024);

    reader.onload = (e) => {
      // The file's text will be printed here
      this.base64Data = reader.result;
      // console.log(e.target.result)
    };

    reader.readAsDataURL(file);

  }



}
