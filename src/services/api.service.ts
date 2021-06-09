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
  // _Url = "http://127.0.0.1:8080";

  //api server URL
  _Url = "https://strif-backend.herokuapp.com" ;
  key = "AIzaSyBEAceBp5yFxmfMRkRngNy-0yyEdsro6-o";

  //ADD
  /*
  * api to add new user to the database
  */
  add_segment(seg_id, snap_points, sys_user_id, municipality, DISTRICT, start_date, end_date, distance, start_coords, end_coords, surface_type, TERR_CLASS, RCAM_CLASS, STATUS) {
    return this.http.post<any>(`${this._Url}/add_segment`, { seg_id, snap_points, sys_user_id, municipality, DISTRICT, start_date, end_date, distance, start_coords, end_coords, surface_type, TERR_CLASS, RCAM_CLASS, STATUS });
  }
  /*
 * api to add new segment to the database
 */
  add_user(user_role, password, date_created, date_modified, email, contact, country, province, municipality, local_municipality, names, surname, username, photo_url, gender, dateofbirth, last_login) {
    return this.http.post<any>(`${this._Url}/add_user`, { user_role, password, date_created, date_modified, email, contact, country, province, municipality, local_municipality, names, surname, username, photo_url, gender, dateofbirth, last_login });
  }
  /*
  * api to add new document to the database
  */
  add_document(title, description, base64Data, file_size, file_extention, District, user_id, date_created, filename) {
    return this.http.post<any>(`${this._Url}/add_document`, { title, description, base64Data, file_size, file_extention, District, user_id, date_created, filename });
  }

  //GET
  /*
  * api user details from databse
  * @params user_id
  */
  get_user(user_id) {
    return this.http.post<any>(`${this._Url}/get_user`, { user_id });
  }

  /*
  * api to get all users by search from the database
  *
  */
  get_all_user(search, SortBy, filterBy) {
    return this.http.post<any>(`${this._Url}/get_all_users`, { search, SortBy, filterBy });
  }

  /*
  * api to get text file from assets
  */
  get_file(file) {
    return this.http.get(`assets/${file}`, { responseType: 'text' });
  }

  /*
  * api to get nearest roads name from googleapis
  */
  get_nearest_roads(points) {
    return this.http.get<any>(`https://roads.googleapis.com/v1/nearestRoads?points=${points}&key=${this.key}`, {});
  }

  /*
  * api to get snapped points on roads from googleapis
  */
  get_snap_points(path) {
    return this.http.get<any>(`https://roads.googleapis.com/v1/snapToRoads?path=${path}&interpolate=true&key=${this.key}`, {});
  }

  /*
  * api to get all documents by search from the database
  */
  get_all_documents(search, SortBy, filterBy, funnelBy) {
    return this.http.post<any>(`${this._Url}/get_all_documents`, { search, SortBy, filterBy, funnelBy });
  }

  /*
  * api to get all segment by search from the database
  */
  get_all_segments(search, SortBy, filterBy, funnelBy) {
    return this.http.post<any>(`${this._Url}/get_all_segments`, { search, SortBy, filterBy, funnelBy });
  }
  /*
  * api to get all segment by search from the database
  */
  get_segment(segment_id) {
    return this.http.post<any>(`${this._Url}/get_segment`, { segment_id });
  }
  /*
 * api to get all segment by search from the database
 */
  get_artifacts_by_segment(segment_id) {
    return this.http.post<any>(`${this._Url}/get_artifacts_by_segment`, { segment_id });
  }
  /*
 * api to get segement defects by segemnt id from the database
 */
  get_segment_defects(segment_id) {
    return this.http.post<any>(`${this._Url}/get_segment_defects`, { segment_id });
  }
  /*
  * api to get all traffic by search from the database
  */
  get_all_traffic(search, SortBy, filterBy, funnelBy) {
    return this.http.post<any>(`${this._Url}/get_all_traffic`, { search, SortBy, filterBy, funnelBy });
  }
  /*
  * api to get all traffic station from the database
  */
  get_all_traffic_station(search, SortBy, filterBy, funnelBy) {
    return this.http.post<any>(`${this._Url}/get_all_traffic_station`, { search, SortBy, filterBy, funnelBy });
  }

  /*
  * api to get all municipality from the database
  */
  get_all_municipality_by_province(province) {
    return this.http.post<any>(`${this._Url}/get_all_municipality_by_province`, { province });
  }
  /*
  * api to get all local_municipality from the database
  */
  get_all_local_municipality(municipality_id) {
    return this.http.post<any>(`${this._Url}/get_all_local_municipality`, { municipality_id });
  }
  /*
 * api to get all traffic stationfrom the database
 */
  get_traffic_station(station_no) {
    return this.http.post<any>(`${this._Url}/get_traffic_station`, { station_no });
  }

  //UPDATE
  //api to update user's details on database
  update_user(user_id, address, country, date_modified, email, gender, names, surname, dateofbirth, province, municipality, local_municipality, user_role) {
    return this.http.post<any>(`${this._Url}/update_user`, { user_id, address, country, date_modified, email, gender, names, surname, dateofbirth, province, municipality, local_municipality, user_role });
  }
  //api to update user's photo
  update_user_photo(photourl) {
    let uuid = localStorage.getItem("uuid");
    return this.http.post<any>(`${this._Url}/update_user_photo`, { photourl, uuid });
  }
  //api to update user password on the databse
  update_password(current_pass, new_pass) {
    let uuid = localStorage.getItem("uuid");
    return this.http.post<any>(`${this._Url}/update_password`, { current_pass, new_pass, uuid });
  }
  /*
  * api to reset user password
  * 
  * @params user_id
  * 
  * user_id can be uuid or email
  */
  resetPassword(email) {
    return this.http.post<any>(`${this._Url}/resetPassword`, { email });
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
  //api to delete segment on the database and server
  remove_segment(segment_id) {
    return this.http.post<any>(`${this._Url}/remove_segment`, { segment_id });
  }
  //api to delete segment on the database and server
  remove_user(user_id) {
    return this.http.post<any>(`${this._Url}/remove_user`, { user_id });
  }
  //api to delete traffic station on the database and server
  remove_traffic_station(traffic_station_id) {
    return this.http.post<any>(`${this._Url}/remove_traffic_station`, { traffic_station_id });
  }

}
