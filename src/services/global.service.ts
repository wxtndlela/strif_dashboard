import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from '../services/api.service';
import { NavController, LoadingController } from '@ionic/angular';

@Injectable()
export class GlobalSettings {
    segments: any[] = [];

    constructor(
        private api: ApiService,
        private navCtrl: NavController,
        private loadingCtrl: LoadingController

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

        this.asses_municipality = new BehaviorSubject<String>('Gert Sibande District Municipality');
        this.asses_filter = new BehaviorSubject<String>('Segments');
        this.asses_report = new BehaviorSubject<String>('');

        this.asses_MunicipalCoords = new BehaviorSubject<Object>({ lat: -26.510634, lng: 29.9120346 });
        this.munic_Borderline = new BehaviorSubject<String>('!4m5!3m4!1s0x1eeb8d69cec5c3e7:0x6f0a14c21c7465bd!8m2!3d-26.5470697!4d29.9740534');

        this.isMobile = new BehaviorSubject<Boolean>(false);

        this.Segments = new BehaviorSubject<Object[]>([]);


        this.Road_furniture = new BehaviorSubject<Object>(
            [
                {
                    name: 'Street Light',
                    type: [

                    ]
                },
                {
                    name: 'Traffic Light',
                    type: [

                    ]
                },
                {
                    name: 'Bollards',
                    type: [
                        { name: 'Masts and foundations' },
                        { name: 'Luminaires' },
                        { name: 'Electrical Supply' },
                    ]
                }, {
                    name: 'Gantry Sign',
                    type: [

                    ]
                }, {
                    name: 'Bus Stop',
                    type: [

                    ]
                }, {
                    name: 'Utility Pole',
                    type: [

                    ]
                }, {
                    name: 'Speed Humps',
                    type: [

                    ]
                }, {
                    name: 'Guard Rails',
                    type: [
                        { name: 'W-Beam: Straight' },
                        { name: 'W-Beam: Curved' },
                        { name: 'Drop-in' },
                    ]
                }, {
                    name: 'Walkaway and Cycle Paths',
                    type: [

                    ]
                }, {
                    name: 'Road Signs',
                    type: [
                        { name: 'Stop' },
                        { name: 'Yield' },
                        { name: 'Speed Limit' },
                        { name: 'Warning' },
                        { name: 'Regulatory' },
                        { name: 'Guidance' },
                        { name: 'Traffic Signals' },
                        { name: 'Information' },
                        { name: 'Combination' },
                        { name: 'Temporary Regulatory' },
                        { name: 'Temporary Warning' },
                        { name: 'Temporary Combination' },
                        { name: 'Comprehensive' },
                        { name: 'Reservation' },
                        { name: 'Prohibition' },
                        { name: 'Command' },
                        { name: 'Control' }
                    ]
                }, {
                    name: 'Manholes',
                    type: [

                    ]
                }, {
                    name: 'Parking',
                    type: [

                    ]
                }, {
                    name: 'Drainage',
                    type: [

                    ]
                }, {
                    name: 'Islands',
                    type: [

                    ]
                }, {
                    name: 'Traffic Circle',
                    type: [

                    ]
                }, {
                    name: 'Other',
                    type: [
                    ]
                },
            ]
        );

        this.Province = new BehaviorSubject<Object>(
            [
                {
                    name: 'Mpumalanga',
                    District: [
                        {
                            name: 'Ehlanzeni District',
                            code: 'DC32',
                            Municipality: [
                                {
                                    code: 'MP325',
                                    name: 'Bushbuckridge',
                                    isChecked: true,
                                    town: [
                                        { name: 'Sabie Park' }
                                    ]
                                },
                                {
                                    code: 'MP326',
                                    name: 'City of Mbombela',
                                    isChecked: true,
                                    town: [
                                        { name: 'Barberton' },
                                        { name: 'Emoyeni' },
                                        { name: 'Entokozweni' },
                                        { name: 'Hazyview' },
                                        { name: 'Kaapschehoop' },
                                        { name: 'Kabokweni' },
                                        { name: 'Kanyamazane' },
                                        { name: 'Matsulu' },
                                        { name: 'Mbombela' },
                                        { name: 'Mpakeni' },
                                        { name: 'Msogwaba' },
                                        { name: 'Skukuza' },
                                        { name: 'Tekwane' },
                                        { name: 'White River' },
                                    ]
                                }, {
                                    code: 'MP324',
                                    name: 'Nkomazi',
                                    isChecked: true,
                                    town: [
                                        { name: 'Komatipoort' },
                                        { name: 'Malalane' },
                                        { name: 'Marloth Park' },
                                    ]
                                }, {
                                    code: 'MP321',
                                    name: 'Thaba Chweu',
                                    isChecked: true,
                                    town: [
                                        { name: 'Graskop' },
                                        { name: 'Lydenburg' },
                                        { name: 'Mashishing' },
                                        { name: 'Pilgrim`s Rest' },
                                        { name: 'Sabie' },
                                    ]
                                }
                            ]
                        }, {
                            name: 'Gert Sibande District',
                            code: 'DC30',
                            Municipality: [
                                {
                                    code: 'MP301',
                                    name: 'Chief Albert Luthuli',
                                    isChecked: true,
                                    town: [
                                        { name: 'Carolina' },
                                        { name: 'Ekulindeni' },
                                        { name: 'Empuluzi' },
                                        { name: 'eManzana' },
                                        { name: 'Ermelo' },
                                    ]
                                },
                                {
                                    code: 'MP302',
                                    name: 'Msukaligwa',
                                    isChecked: true,
                                    town: [
                                        { name: 'Carolina' },
                                        { name: 'Ekulindeni' },
                                        { name: 'Empuluzi' },
                                        { name: 'eManzana' },
                                    ]
                                }, {
                                    code: 'MP303',
                                    name: 'Mkhondo',
                                    isChecked: true,
                                    town: [
                                        { name: 'Amsterdam' },
                                        { name: 'eMkhondo (Piet Retief)' },
                                    ]
                                }, {
                                    code: 'MP304',
                                    name: 'Dr Pixley Ka Isaka Seme',
                                    isChecked: true,
                                    town: [
                                        { name: 'Amersfoort' },
                                        { name: 'Perdekop' },
                                        { name: 'Volksrust' },
                                        { name: 'Wakkerstroom' },
                                    ]
                                }, {
                                    code: 'MP305',
                                    name: 'Lekwa',
                                    isChecked: true,
                                    town: [
                                        { name: 'Morgenzon' },
                                        { name: 'Standerton' },
                                    ]
                                }, {
                                    code: 'MP306',
                                    name: 'Dipaleseng',
                                    isChecked: true,
                                    town: [
                                        { name: 'Balfour' },
                                        { name: 'Greylingstad' },
                                        { name: 'Grootvlei' },
                                    ]
                                }, {
                                    code: 'MP307',
                                    name: 'Govan Mbeki',
                                    isChecked: true,
                                    town: [
                                        { name: 'Bethal' },
                                        { name: 'Charl Cilliers' },
                                        { name: 'Embalenhle' },
                                        { name: 'Evander' },
                                    ]
                                }
                            ]
                        },
                        {
                            name: 'Nkangala District',
                            code: 'DC31',
                            Municipality: [
                                {
                                    code: 'MP312',
                                    name: 'Emalahleni',
                                    isChecked: true,
                                    town: [
                                        { name: 'Kriel' },
                                        { name: 'Ogies' },
                                        { name: 'Phola' },
                                        { name: 'eMalahleni' },
                                    ]
                                },
                                {
                                    code: 'MP315',
                                    name: 'Thembisile Hani',
                                    isChecked: true,
                                    town: [
                                        { name: 'KwaMhlanga' },
                                    ]
                                }, {
                                    code: 'MP316',
                                    name: 'Dr JS Moroka',
                                    isChecked: true,
                                    town: [
                                        { name: 'Mdala Nature Reserve' },
                                    ]
                                }, {
                                    code: 'MP313',
                                    name: 'Steve Tshwete',
                                    isChecked: true,
                                    town: [
                                        { name: 'Hendrina' },
                                        { name: 'Middelburg' },
                                        { name: 'Pullens Hope' },
                                        { name: 'Rietkuil' },
                                    ]
                                }, {
                                    code: 'MP311',
                                    name: 'Victor Khanye',
                                    isChecked: true,

                                    town: [
                                        { name: 'Delmas' },
                                    ]
                                }, {
                                    code: 'MP314',
                                    name: 'Emakhazeni',
                                    isChecked: true,
                                    town: [
                                        { name: 'Dullstroom' },
                                        { name: 'Emgwenya (Waterval Boven)' },
                                        { name: 'eMakhazeni' },
                                        { name: 'eNtokozweni (Machadodorp)' },
                                    ]
                                }
                            ]
                        },
                    ]
                }
            ]
        );

        this.selected_province = new BehaviorSubject<String>('Mpumalanga');
        this.selected_district = new BehaviorSubject<String>('Gert Sibande District');

        let Province: any = this.Province.value;
        let selected_district = this.selected_district.value;
        let selected_province = this.selected_province.value;

        for (let index = 0; index < Province.length; index++) {
            const province = Province[index];
            if (province.name == selected_province) {
                let District = province.District;
                for (let index = 0; index < District.length; index++) {
                    const district = District[index];
                    if (district.name == selected_district) {
                        let Municipality: any = district.Municipality;
                        let MUNIC = [];
                        for (let index = 0; index < Municipality.length; index++) {
                            const municipality = Municipality[index];
                            MUNIC.push(municipality);
                        }
                        this.MUNIC = new BehaviorSubject<Object>(MUNIC);
                        console.log('MUNIC:', MUNIC);
                        /*take a */ break;
                    }
                }
            }
        }

        this.SURF_TYPE = new BehaviorSubject<Object>(
            [
                {
                    name: 'BLOC',
                    isChecked: true,
                    borderline: '!4m5!3m4!1s0x1eeb8d69cec5c3e7:0x6f0a14c21c7465bd!8m2!3d-26.5470697!4d29.9740534'
                },
                {
                    name: 'FLEX',
                    isChecked: true
                },
                {
                    name: 'GRAV',
                    isChecked: true
                },
            ]
        );

        this.SEGMENT_STATUS = new BehaviorSubject<Object>(
            [
                {
                    name: 'Not Assesed',
                    level: 0,
                    color: "#4B0082",
                    isChecked: true,
                },
                {
                    name: 'Very Good',
                    level: 1,
                    color: "#4B0082",
                    isChecked: true,
                },
                {
                    name: 'Good',
                    level: 2,
                    color: "#4B0082",
                    isChecked: true,
                }, {
                    name: 'Moderate',
                    level: 3,
                    color: "#4B0082",
                    isChecked: true,
                }, {
                    name: 'Poor',
                    level: 4,
                    color: "#4B0082",
                    isChecked: true,
                }, {
                    name: 'Very poor',
                    level: 5,
                    color: "#4B0082",
                    isChecked: true,
                },
            ]
        );

        this.ASSESMENT_STATUS = new BehaviorSubject<Object>(
            [
                {
                    name: 'Not Assesed',
                    level: 0,
                    color: "#4B0082",
                    isChecked: true,
                },
                {
                    name: 'Assesed',
                    level: 1,
                    color: "#4B0082",
                    isChecked: true,
                },

            ]
        );

        this.ASSESMENT_STATUS_COUNT = new BehaviorSubject<Object>(
            [
                {
                    name: 'Not Assesed',
                    level: 0,
                    count: 0,
                },
                {
                    name: 'Assesed',
                    level: 1,
                    count: 0,
                },

            ]
        );

        this.SEGMENT_STATUS_COUNT = new BehaviorSubject<Object>(
            [
                {
                    name: 'Not Assesed',
                    level: 0,
                    count: 0,
                },
                {
                    name: 'Very Good',
                    level: 1,
                    count: 0,

                },
                {
                    name: 'Good',
                    level: 2,
                    count: 0,

                }, {
                    name: 'Moderate',
                    level: 3,
                    count: 0,

                }, {
                    name: 'Poor',
                    level: 4,
                    count: 0,

                }, {
                    name: 'Very poor',
                    level: 5,
                    count: 0,

                },
            ]
        );

        this.MUNIC_COUNT = new BehaviorSubject<Object>(
            [
                {
                    code: 'MP301',
                    count: 0,
                }, {
                    code: 'MP302',
                    count: 0,
                }, {
                    code: 'MP303',
                    count: 0,
                }, {
                    code: 'MP304',
                    count: 0,
                }, {
                    code: 'MP305',
                    count: 0,
                }, {
                    code: 'MP305',
                    count: 0,
                }, {
                    code: 'MP306',
                    count: 0,
                }, {
                    code: 'MP307',
                    count: 0,
                },
            ]
        );

        this.SURF_TYPE_COUNT = new BehaviorSubject<Object>(
            [
                {
                    code: 'BLOC',
                    count: 0,
                }, {
                    code: 'FLEX',
                    count: 0,
                }, {
                    code: 'GRAV',
                    count: 0,
                }
            ]
        );

        this.isDrawing = new BehaviorSubject<Boolean>(true);

    }

    public isDrawing: BehaviorSubject<Object>;
    set_isDrawing(newValue): void {
        this.isDrawing.next(newValue);
    }
    get_isDrawing(): Observable<Object> {
        return this.isDrawing.asObservable();
    }

    public ASSESMENT_STATUS_COUNT: BehaviorSubject<Object>;
    set_ASSESMENT_STATUS_COUNT(newValue): void {
        this.ASSESMENT_STATUS_COUNT.next(newValue);
    }
    get_ASSESMENT_STATUS_COUNT(): Observable<Object> {
        return this.ASSESMENT_STATUS_COUNT.asObservable();
    }

    public MUNIC_COUNT: BehaviorSubject<Object>;
    set_MUNIC_COUNT(newValue): void {
        this.MUNIC_COUNT.next(newValue);
    }
    get_MUNIC_COUNT(): Observable<Object> {
        return this.MUNIC_COUNT.asObservable();
    }

    public ASSESMENT_STATUS: BehaviorSubject<Object>;
    set_ASSESMENT_STATUS(newValue): void {
        this.ASSESMENT_STATUS.next(newValue);
    }
    get_ASSESMENT_STATUS(): Observable<Object> {
        return this.ASSESMENT_STATUS.asObservable();
    }

    public Segments: BehaviorSubject<Object>;
    set_Segments(newValue): void {
        this.Segments.next(newValue);
    }
    get_Segments(): Observable<Object> {
        return this.Segments.asObservable();
    }

    public SURF_TYPE_COUNT: BehaviorSubject<Object>;
    set_SURF_TYPE_COUNT(newValue): void {
        this.SURF_TYPE_COUNT.next(newValue);
    }
    get_SURF_TYPE_COUNT(): Observable<Object> {
        return this.SURF_TYPE_COUNT.asObservable();
    }

    public SEGMENT_STATUS: BehaviorSubject<Object>;
    set_SEGMENT_STATUS(newValue): void {
        this.SEGMENT_STATUS.next(newValue);
    }
    get_SEGMENT_STATUS(): Observable<Object> {
        return this.SEGMENT_STATUS.asObservable();
    }

    public SEGMENT_STATUS_COUNT: BehaviorSubject<Object>;
    set_SEGMENT_STATUS_COUNT(newValue): void {
        this.SEGMENT_STATUS_COUNT.next(newValue);
    }
    get_SEGMENT_STATUS_COUNT(): Observable<Object> {
        return this.SEGMENT_STATUS_COUNT.asObservable();
    }

    public SURF_TYPE: BehaviorSubject<Object>;
    set_SURF_TYPE(newValue): void {
        this.SURF_TYPE.next(newValue);
    }
    get_SURF_TYPE(): Observable<Object> {
        return this.SURF_TYPE.asObservable();
    }

    public MUNIC: BehaviorSubject<Object>;
    set_MUNIC(newValue): void {
        this.MUNIC.next(newValue);
    }
    get_MUNIC(): Observable<Object> {
        return this.MUNIC.asObservable();
    }

    public selected_district: BehaviorSubject<Object>;
    set_selected_district(newValue): void {
        this.selected_district.next(newValue);
    }
    get_selected_district(): Observable<Object> {
        return this.selected_district.asObservable();
    }

    public selected_province: BehaviorSubject<Object>;
    set_selected_province(newValue): void {
        this.selected_province.next(newValue);
    }
    get_selected_province(): Observable<Object> {
        return this.selected_province.asObservable();
    }


    public Road_furniture: BehaviorSubject<Object>;
    set_Road_furniture(newValue): void {
        this.Road_furniture.next(newValue);
    }
    get_Road_furniture(): Observable<Object> {
        return this.Road_furniture.asObservable();
    }

    public Province: BehaviorSubject<Object>;
    set_Province(newValue): void {
        this.Province.next(newValue);
    }
    get_Province(): Observable<Object> {
        return this.Province.asObservable();
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

    public munic_Borderline: BehaviorSubject<Object>;
    set_munic_Borderline(newValue): void {
        this.munic_Borderline.next(newValue);
    }
    get_munic_Borderline(): Observable<Object> {
        return this.munic_Borderline.asObservable();
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
            this.api.get_user(user_id).subscribe(res => {
                this.set_user_name(res.data[0].names + ' ' + res.data[0].surname);
                // this.navCtrl.navigateRoot('assesments')
                if (res.data[0].photourl == '') {
                    this.set_user_avater(res.data[0].photourl);
                }
            })
            // this.get_segment();
        }
    }

    public async get_segment() {
        const loading = await this.loadingCtrl.create({
            message: 'Loading segments ....'
        })

        loading.present();

        this.api.get_all_segments('', 'SortBy', 'filterBy', 'funnelBy').subscribe(data => {
            console.log('Segment data:', data.data);
            this.segments = data.data;
            this.set_Segments(this.segments)
            loading.dismiss();
        })
    }



}
