import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { NavController, ModalController, LoadingController } from "@ionic/angular";
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  constructor(
    private http: HttpClient,
    public loadingCtrl: LoadingController,
    private alert: AlertService,
  ) {
  }

  //api tesing server URL
  _Url = "http://127.0.0.1:3000";

  //api server URL
  //_Url = "https://lmcapi.onrender.com";
  key = "AIzaSyDEXh7Kl0XjVFs8LfBRbAwTDq63vpyvXCY";
  _carURL = "https://private-anon-939979d007-carsapi1.apiary-mock.com";

  //Google Places
  //api to get autocomplete address by text
  get_places(input) {
    return this.http.post<any>(`${this._Url}/get_places`, { input });
  }
  //api to get address by coordinates
  get_reverse_geocode(latlng) {
    return this.http.post<any>(`${this._Url}/get_reverse_geocode`, { latlng });
  }
  //api to get coordinates by address
  get_Forward_geocode(address) {
    return this.http.post<any>(`${this._Url}/get_Forward_geocode`, { address });
  }
  //api to get directions from a to b by coordinates
  get_directions(origin, destination) {
    return this.http.post<any>(`${this._Url}/get_directions`, { origin, destination });
  }

  //NOTIFICATIONS
  //api to send a text message to a specific cellphone number
  send_SMS(tel, msg) {
    return this.http.post<any>(`${this._Url}/send_SMS`, { tel, msg });
  }

  //ADD
  //api to add new user to the database
  add_new_user(user_role, address, country, datecreated, modifiedondatetime, email, password, gender, names, surname, contact) {
    return this.http.post<any>(`${this._Url}/add_new_user`, { user_role, address, country, datecreated, modifiedondatetime, email, password, gender, names, surname, contact });
  }
  //api to add new request
  add_new_request(description, weight, price, destination_address, destination_coords, collection_address, collection_coords, reciever_name, reciever_cell, request_notes, request_status, addedondatetime, schedule_time) {
    let client_id = localStorage.getItem("uuid");
    return this.http.post<any>(`${this._Url}/add_new_request`, { description, weight, price, destination_address, collection_address, reciever_name, reciever_cell, request_notes, request_status, client_id, addedondatetime, destination_coords, collection_coords, schedule_time });
  }
  //api to add new license to the databse
  add_new_license(driver_id, license_id, addedondatetime, modifiedondatetime, photo_url) {
    return this.http.post<any>(`${this._Url}/add_new_license`, { driver_id, license_id, addedondatetime, modifiedondatetime, photo_url });
  }
  //api to add new bank accout to database
  add_new_bank_acc(driver_id, addedondatetime, branch_code, bank_name, account_no, account_type) {
    return this.http.post<any>(`${this._Url}/add_new_bank_acc`, { driver_id, addedondatetime, branch_code, bank_name, account_no, account_type });
  }
  //api to add new device for firebasse cloud messeging
  add_new_device(user_id, addedondatetime, token) {
    return this.http.post<any>(`${this._Url}/add_new_device`, { user_id, addedondatetime, token });
  }
  //api to add new user credit card to database
  add_new_card(card_number, card_cvv, card_holder_name, card_exp_year, card_exp_month, client_id, addedondatetime) {
    return this.http.post<any>(`${this._Url}/add_new_card`, { card_number, card_cvv, card_holder_name, card_exp_year, card_exp_month, client_id, addedondatetime });
  }
  //api to add new driver delivery to database
  add_new_delivery(requsest_id, delivery_status, driver_id, addedondatetime) {
    return this.http.post<any>(`${this._Url}/add_new_delivery`, { requsest_id, delivery_status, driver_id, addedondatetime });
  }
  //api to add new payment for request to the database
  add_new_payment(requsest_id, client_card_id, addedondatetime, amount, currency, status) {
    return this.http.post<any>(`${this._Url}/add_new_payment`, { requsest_id, client_card_id, addedondatetime, amount, currency, status });
  }
  //api to add new driver vehicle to the database
  add_new_vehicle(model, make, year, type, registration_number, modifiedondatetime, photo_url, addedondatetime) {
    let driver_id = localStorage.getItem("uuid");
    return this.http.post<any>(`${this._Url}/add_new_vehicle`, { driver_id, model, make, year, type, registration_number, modifiedondatetime, photo_url, addedondatetime });
  }
  //api to add new document to the database
  add_new_document(doc_title, doc_type, modifiedondatetime, doc_url, doc_body, sys_user_id, addedondatetime) {
    return this.http.post<any>(`${this._Url}/add_new_document`, { doc_title, doc_type, modifiedondatetime, doc_url, doc_body, sys_user_id, addedondatetime });
  }
  //api to add new query to the database
  add_new_query(query, event_type, status, response, addedondatetime) {
    let user_id = localStorage.getItem("uuid");
    return this.http.post<any>(`${this._Url}/add_new_query`, { query, event_type, status, response, user_id, addedondatetime });
  }
  //api to add new driver status to the database
  add_driver_loc(current_loc_coords, status, modifiedondatetime) {
    let driver_id = localStorage.getItem("uuid");
    return this.http.post<any>(`${this._Url}/add_driver_loc`, { driver_id, current_loc_coords, status, modifiedondatetime });
  }
  //api to assign specials request to the database
  add_new_special_delivery(requsest_id, delivery_status, driver_id, addedondatetime, price) {
    return this.http.post<any>(`${this._Url}/add_new_special_delivery`, { requsest_id, delivery_status, driver_id, addedondatetime, price });
  }


  //GET
  //api user details from databse
  get_user() {
    //user id
    let user_id = localStorage.getItem("uuid");
    return this.http.post<any>(`${this._Url}/get_user`, { user_id });
  }
  //api to get documents by type from database
  get_document_by_type(doc_type) {
    //user id
    let user_id = localStorage.getItem("uuid");
    return this.http.post<any>(`${this._Url}/get_document_by_type`, { doc_type });
  }
  //apito get client card from database
  get_client_card() {
    //user id
    let user_id = localStorage.getItem("uuid");
    return this.http.post<any>(`${this._Url}/get_client_card`, { user_id });
  }
  //api to get client's requests from database
  get_all_request() {
    //user id
    let user_id = localStorage.getItem("uuid");
    return this.http.post<any>(`${this._Url}/get_all_request`, { user_id });
  }
  //api to get driver's bank account details from database
  get_driver_bank_acc() {
    //user id
    let user_id = localStorage.getItem("uuid");
    return this.http.post<any>(`${this._Url}/get_driver_bank_acc`, { user_id });
  }
  //api to get driver's vehicle datails from databse
  get_driver_Vehicle() {
    //user id
    let user_id = localStorage.getItem("uuid");
    return this.http.post<any>(`${this._Url}/get_driver_Vehicle`, { user_id });
  }
  //api to get driver's license
  get_driver_license() {
    //user id
    let user_id = localStorage.getItem("uuid");
    return this.http.post<any>(`${this._Url}/get_driver_license`, { user_id });
  }
  //api to get driver's delivery request details from database
  get_driver_delivery() {
    //user id
    let user_id = localStorage.getItem("uuid");
    return this.http.post<any>(`${this._Url}/get_driver_delivery`, { user_id });
  }
  //api to get documents by type from database
  get_documents_by_type(doc_type) {
    return this.http.post<any>(`${this._Url}/get_documents_by_type`, { doc_type });
  }
  //api to get car manufacturer list
  get_vmake() {
    return this.http.get<any>(`${this._carURL}/manufacturers`);
  }
  //api to get driver status from database
  get_driver_status() {
    let driver_id = localStorage.getItem("uuid");
    return this.http.get<any>(`${this._Url}/get_driver_status/${driver_id}`);
  }
  //api to get all driver by status from the database
  get_all_driver_by_status(status) {
    return this.http.post<any>(`${this._Url}/get_all_driver_by_status`, { status });
  }
  //api to get all parcels by description from the database
  get_all_parcel_by_desc(description) {
    let uuid = localStorage.getItem("uuid");
    return this.http.post<any>(`${this._Url}/get_all_parcel_by_desc`, { uuid, description });
  }
  //api to get b request by id from the database
  get_request(request_id) {
    return this.http.post<any>(`${this._Url}/get_request`, { request_id });
  }
  //api to get all users by search from the database
  get_all_user(search, SortBy, filterBy) {
    return this.http.post<any>(`${this._Url}/get_all_user`, { search, SortBy, filterBy });
  }
  //api to get all documents by search from the database
  get_all_documents(search, SortBy, filterBy, funnelBy) {
    return this.http.post<any>(`${this._Url}/get_all_documents`, { search, SortBy, filterBy, funnelBy });
  }
  //api to get all parcels by search from the database
  get_all_parcels(search, SortBy, filterBy) {
    return this.http.post<any>(`${this._Url}/get_all_parcels`, { search, SortBy, filterBy });
  }
  //api to get all parcels by search from the database
  get_all_special_request(search, SortBy, filterBy) {
    return this.http.post<any>(`${this._Url}/get_all_special_request`, { search, SortBy, filterBy });
  }
  //api to get all parcels by search from the database
  get_all_query(search, SortBy, filterBy) {
    return this.http.post<any>(`${this._Url}/get_all_query`, { search, SortBy, filterBy });
  }
  //api to get all drivers by search from the database
  get_all_drivers(search, SortBy, filterBy) {
    return this.http.post<any>(`${this._Url}/get_all_drivers`, { search, SortBy, filterBy });
  }

  //UPDATE
  //api to update user's details on database
  update_user(address, country, modifiedondatetime, email, gender, names, surname, dateofbirth) {
    let uuid = localStorage.getItem("uuid");
    return this.http.post<any>(`${this._Url}/update_user`, { address, country, modifiedondatetime, email, gender, names, surname, dateofbirth, uuid });
  }
  //api to update user's photo
  update_user_photo(photourl) {
    let uuid = localStorage.getItem("uuid");
    return this.http.post<any>(`${this._Url}/update_user_photo`, { photourl, uuid });
  }
  //api to update driver delivery request on database
  update_driver_delivery_status(delivery_status, requsest_id) {
    return this.http.post<any>(`${this._Url}/update_driver_delivery_status`, { delivery_status, requsest_id });
  }
  //api to update client request's status on the databse
  update_client_request_status(delivery_status, requsest_id) {
    return this.http.post<any>(`${this._Url}/update_client_request_status`, { delivery_status, requsest_id });
  }
  //api to update user password on the databse
  update_password(current_pass, new_pass) {
    let uuid = localStorage.getItem("uuid");
    return this.http.post<any>(`${this._Url}/update_password`, { current_pass, new_pass, uuid });
  }
  //api to reset user password on the databse
  resetPassword(user_telEmail) {
    let user_id = localStorage.getItem("uuid");
    return this.http.post<any>(`${this._Url}/resetPassword`, { user_id, user_telEmail });
  }
  //api to reset user password on the databse
  update_driver_status(current_loc_coords, status, modifiedondatetime) {
    let driver_id = localStorage.getItem("uuid");
    return this.http.post<any>(`${this._Url}/update_driver_status`, { driver_id, current_loc_coords, status, modifiedondatetime });
  }
  //api to update document on the databse
  update_document(doc_id, doc_title, doc_type, doc_url, modifiedondatetime) {
    let driver_id = localStorage.getItem("uuid");
    return this.http.post<any>(`${this._Url}/update_document`, { doc_id, doc_title, doc_type, doc_url, modifiedondatetime });
  }
  //api to response to a query
  update_response(query, response, status, query_id, user_id) {
    return this.http.post<any>(`${this._Url}/update_response`, { query, response, status, query_id, user_id });
  }

  //DELETE
  //api to delete client's card on database
  remove_client_card(card_id) {
    return this.http.post<any>(`${this._Url}/remove_client_card`, { card_id });
  }
  //api to delete firebase cloud messging device on database
  remove_fcm_device(token) {
    return this.http.post<any>(`${this._Url}/remove_fcm_device`, { token });
  }
  //api to delete document on the database and server
  remove_document(doc_id) {
    return this.http.post<any>(`${this._Url}/remove_document`, { doc_id });
  }



}
