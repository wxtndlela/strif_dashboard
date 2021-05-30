import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from '../services/api.service';
import {NavController} from '@ionic/angular';

@Injectable()
export class GlobalSettings {

    constructor(
        private api: ApiService,
        private navCtrl: NavController,
    ) {

        this.user_filter_by = new BehaviorSubject<String>('names');
        this.user_sort_by = new BehaviorSubject<String>('ASC');

        this.doc_filter_by = new BehaviorSubject<String>('doc_title');
        this.docs_sort_by = new BehaviorSubject<String>('ASC');
        this.docs_funnel_by = new BehaviorSubject<String>('all');

        this.traffic_sort_by = new BehaviorSubject<String>('ASC');
        this.traffic_filter_by = new BehaviorSubject<String>('vehicle_type');

        this.user_name = new BehaviorSubject<String>('');
        this.user_avater = new BehaviorSubject<String>('../../assets/avater-default.png');
        
        this.asses_municipality = new BehaviorSubject<String>('all municipalities');
        this.asses_filter = new BehaviorSubject<String>('pothole');
        this.asses_report = new BehaviorSubject<String>('');

        this.asses_MunicipalCoords = new BehaviorSubject<Object>({ lat:-25.998782, lng:28.127535 });
        this.isMobile = new BehaviorSubject<Boolean>(false);
        this.Municipality = new BehaviorSubject<Object>(null);
    }

    public Municipality: BehaviorSubject<Object>;
    set_Municipality(newValue): void {
        this.Municipality.next(newValue);
    }
    get_Municipality(): Observable<Object> {
        return this.Municipality.asObservable();
    }


    public isMobile: BehaviorSubject<Object>;
    set_isMobile(newValue): void {
        this.isMobile.next(newValue);
    }
    get_isMobile(): Observable<Object> {
        return this.isMobile.asObservable();
    }

    public traffic_sort_by: BehaviorSubject<Object>;
    set_traffic_sort_by(newValue): void {
        this.traffic_sort_by.next(newValue);
    }
    get_traffic_sort_by(): Observable<Object> {
        return this.traffic_sort_by.asObservable();
    }

    public traffic_filter_by: BehaviorSubject<Object>;
    set_traffic_filter_by(newValue): void {
        this.traffic_filter_by.next(newValue);
    }
    get_traffic_filter_by(): Observable<Object> {
        return this.traffic_filter_by.asObservable();
    }

    public asses_MunicipalCoords: BehaviorSubject<Object>;
    set_asses_MunicipalCoords(newValue): void {
        this.asses_MunicipalCoords.next(newValue);
    }
    get_asses_MunicipalCoords(): Observable<Object> {
        return this.asses_MunicipalCoords.asObservable();
    }

    public asses_report: BehaviorSubject<String>;
    set_asses_report(newValue): void {
        this.asses_report.next(newValue);
    }
    get_asses_report(): Observable<String> {
        return this.asses_report.asObservable();
    }

    public asses_filter: BehaviorSubject<String>;
    set_asses_filter(newValue): void {
        this.asses_filter.next(newValue);
    }
    get_asses_filter(): Observable<String> {
        return this.asses_filter.asObservable();
    }

    public asses_municipality: BehaviorSubject<String>;
    set_asses_municipality(newValue): void {
        this.asses_municipality.next(newValue);
    }
    get_asses_municipality(): Observable<String> {
        return this.asses_municipality.asObservable();
    }

    public user_avater: BehaviorSubject<String>;
    set_user_avater(newValue): void {
        this.user_avater.next(newValue);
    }
    get_user_avater(): Observable<String> {
        return this.user_avater.asObservable();
    }

    public user_name: BehaviorSubject<String>;
    set_user_name(newValue): void {
        this.user_name.next(newValue);
    }
    get_user_name(): Observable<String> {
        return this.user_name.asObservable();
    }

    public driver_sort_by: BehaviorSubject<String>;
    set_driver_sort_by(newValue): void {
        this.driver_sort_by.next(newValue);
    }
    get_driver_sort_by(): Observable<String> {
        return this.driver_sort_by.asObservable();
    }

    public driver_filter_by: BehaviorSubject<String>;
    set_driver_filter_by(newValue): void {
        this.driver_filter_by.next(newValue);
        console.log(this.driver_filter_by)
    }
    get_driver_filter_by(): Observable<String> {
        return this.driver_filter_by.asObservable();
    }


    public doc_filter_by: BehaviorSubject<String>;
    set_doc_filter_by(newValue): void {
        this.doc_filter_by.next(newValue);
    }
    get_doc_filter_by(): Observable<String> {
        return this.doc_filter_by.asObservable();
    }

    public docs_sort_by: BehaviorSubject<String>;
    set_docs_sort_by(newValue): void {
        this.docs_sort_by.next(newValue);
    }
    get_docs_sort_by(): Observable<String> {
        return this.docs_sort_by.asObservable();
    }

    public docs_funnel_by: BehaviorSubject<String>;
    set_docs_funnel_by(newValue): void {
        this.docs_funnel_by.next(newValue);
    }
    get_docs_funnel_by(): Observable<String> {
        return this.docs_funnel_by.asObservable();
    }

    public user_filter_by: BehaviorSubject<String>;
    set_user_filter_by(newValue): void {
        this.user_filter_by.next(newValue);
    }
    get_user_filter_by(): Observable<String> {
        return this.user_filter_by.asObservable();
    }

    public user_sort_by: BehaviorSubject<String>;
    set_user_sort_by(newValue): void {
        this.user_sort_by.next(newValue);
    }
    get_user_sort_by(): Observable<String> {
        return this.user_sort_by.asObservable();
    }


    public special_sort_by: BehaviorSubject<String>;
    set_special_sort_by(newValue): void {
        this.special_sort_by.next(newValue);
    }
    get_special_sort_by(): Observable<String> {
        return this.special_sort_by.asObservable();
    }

    public special_filter_by: BehaviorSubject<String>;
    set_special_filter_by(newValue): void {
        this.special_filter_by.next(newValue);
    }
    get_special_filter_by(): Observable<String> {
        return this.special_filter_by.asObservable();
    }

    public query_sort_by: BehaviorSubject<String>;
    set_query_sort_by(newValue): void {
        this.query_sort_by.next(newValue);
    }
    get_query_sort_by(): Observable<String> {
        return this.query_sort_by.asObservable();
    }

    public query_filter_by: BehaviorSubject<String>;
    set_query_filter_by(newValue): void {
        this.query_filter_by.next(newValue);
    }
    get_query_filter_by(): Observable<String> {
        return this.query_filter_by.asObservable();
    }

    public set_user_settings() {
        let user_id = localStorage.getItem("uuid");
        if (user_id != null) {
            this.api.get_user().subscribe(res => {
                this.set_user_name(res.data[0].names + ' ' + res.data[0].surname);
                this.navCtrl.navigateRoot('assesments')
                if (res.data[0].photourl == '') {
                    this.set_user_avater(res.data[0].photourl);
                }
            })
        }
    }

}
