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
  // _Url = "http://127.0.0.1:3000";

  //api server URL1
  // _Url = "https://strif-backend.herokuapp.com";
  _Url = "https://novo-rams-backend.onrender.com";

  public _Url1 = "https://lmcapi.onrender.com";
  key = "AIzaSyDpdp4k5ZfK03StYzYWLwnan7oex-s7Org";

  //api to get address by coordinates
  get_reverse_geocode(latlng) {
    return this.http.post<any>(`${this._Url1}/get_reverse_geocode`, { latlng });
  }


  //ADD
  /*
  * api to add new user to the database
  */
  add_segment(
    snap_points,
    SEG_ID,
    sys_user_id,
    MUNIC,
    DISTRICT,
    AUTH_ID,
    AUTH_ROAD_ID,
    RDDA_ID,
    LEG_SEG_ID,
    ROUTE,
    START_DATE,
    END_DATE,
    NODE_TYPE,
    SADC_ROUTE,
    AUTH_RD_DIR,
    START_KM,
    END_KM,
    END_LATITUDE,
    END_LONGITUDE,
    START_LATITUDE,
    START_LONGITUDE,
    START_DESC,
    END_DESC,
    GIS_LINK_ID,
    SURF_TYPE,
    TERR_CLASS,
    RCAM_CLASS,
    ROAD_WIDTH,
    GRADIENT,
    NO_LANES,
    NO_SHOULDER,
    ROAD_TYPE,
    BASE_DATE,
    SURFACE_DATE,
    ROAD_NAME,
    LANE_CODE,
    SEGMENT_STATUS,
    LANE_SEG_ID,
    CL_OFFSET,
    SHOULDER_TYPE,
    OWNER
  ) {
    return this.http.post<any>(`${this._Url}/add_segment`,
      {
        snap_points,
        SEG_ID,
        sys_user_id,
        MUNIC,
        DISTRICT,
        AUTH_ID,
        AUTH_ROAD_ID,
        RDDA_ID,
        LEG_SEG_ID,
        ROUTE,
        START_DATE,
        END_DATE,
        NODE_TYPE,
        SADC_ROUTE,
        AUTH_RD_DIR,
        START_KM,
        END_KM,
        END_LATITUDE,
        END_LONGITUDE,
        START_LATITUDE,
        START_LONGITUDE,
        START_DESC,
        END_DESC,
        GIS_LINK_ID,
        SURF_TYPE,
        TERR_CLASS,
        RCAM_CLASS,
        ROAD_WIDTH,
        GRADIENT,
        NO_LANES,
        NO_SHOULDER,
        ROAD_TYPE,
        BASE_DATE,
        SURFACE_DATE,
        ROAD_NAME,
        LANE_CODE,
        SEGMENT_STATUS,
        LANE_SEG_ID,
        CL_OFFSET,
        SHOULDER_TYPE,
        OWNER
      }
    );
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
  /*
  * api to add a new structure to the database
  */
  add_structure(municipality, DISTRICT, FEATURE, TYPE, DESCRIPTION, NAME, SERVICE, DIAMETER, DISTANCE_FROM_ROAD, height, width, length, quantity, START_LATITUDE, START_LONGITUDE, COMMENTS) {
    return this.http.post<any>(`${this._Url}/add_structure`, { municipality, DISTRICT, FEATURE, TYPE, DESCRIPTION, NAME, SERVICE, DIAMETER, DISTANCE_FROM_ROAD, height, width, length, quantity, START_LATITUDE, START_LONGITUDE, COMMENTS });
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
  * api to get segment from the database
  */
  get_segment(segment_id) {
    return this.http.post<any>(`${this._Url}/get_segment`, { segment_id });
  } /*
  * api to get_structure from the database
  */
  get_structure(structure_id) {
    return this.http.post<any>(`${this._Url}/get_structure`, { structure_id });
  } /*
  * api to get_furniture from the database
  */
  get_furniture(furniture_id) {
    return this.http.post<any>(`${this._Url}/get_furniture`, { furniture_id });
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
  /*
  * api to get_all_furniture from the database
  */
  get_all_furniture() {
    return this.http.post<any>(`${this._Url}/get_all_furniture`, {});
  }
  /*
 * api to get_all_furniture from the database
 */
  get_all_structure() {
    return this.http.post<any>(`${this._Url}/get_all_structure`, {});
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
