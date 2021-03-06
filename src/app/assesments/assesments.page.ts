import { Component, OnInit, AfterViewInit } from '@angular/core';
// import { GoogleMap, GoogleMapsModule } from '@angular/google-maps'
import { ApiService } from '../../services/api.service';
import { AlertService } from '../../services/alert.service';
import { ToasterService } from '../../services/toaster.service';
import { PopoverController, ModalController, ToastController, LoadingController } from '@ionic/angular';
import { FilterComponent } from '../components/filter/filter.component';
import { GlobalSettings } from '../../services/global.service';
import { AddSegmentPage } from '../add-segment/add-segment.page';
import { InfoModalPage } from '../components/info-modal/info-modal.page';
import { LayersComponent } from '../components/layers/layers.component';
import { AddOptionsComponent } from '../components/add-options/add-options.component';
import { poly2geo } from '../../assets/js/map.service';
import tokml from "geojson-to-kml";
import polyline from '@mapbox/polyline';
import * as shpwrite from 'shp-write';
import { FileService } from '../../services/file.service';
@Component({
  selector: 'app-assesments',
  templateUrl: './assesments.page.html',
  styleUrls: ['./assesments.page.scss'],
})

export class AssesmentsPage implements OnInit, AfterViewInit {

  Traffic_station: any;
  public Parcels: any = [];
  public results_count = 0;
  public searchText = '';
  public filterBy: String = '';
  public assesMunicipality: String = '';
  private Segments: any = [];
  Furniture: any;
  Structure: any;
  atrifact_image = "../../../assets/artifacts/DJI_0940.JPG";
  public list = [];
  public SURF_TYPE: any;
  public MUNIC: any;
  public SEGMENT_STATUS: any = this.global.SEGMENT_STATUS.value;
  public ASSESMENT_STATUS: any = this.global.ASSESMENT_STATUS.value;
  public SURF_TYPE_COUNT: any = this.global.SURF_TYPE_COUNT.value;
  public MUNIC_COUNT: any = this.global.MUNIC_COUNT.value;
  public SEGMENT_STATUS_COUNT: any = this.global.SEGMENT_STATUS_COUNT.value;
  public ASSESMENT_STATUS_COUNT: any = this.global.ASSESMENT_STATUS_COUNT.value;
  public current_place = '';
  private distance = 0;
  public segments_length = 0;
  private road_name = '';
  private snapped_points: any;
  private polyline: any[] = [];

  routes: any[];
  public mapHeight = 70;
  private map: google.maps.Map;
  private marker: any[] = [];

  zoom: 8.53;
  center: any;
  options: google.maps.MapOptions = {
    mapTypeId: 'hybrid',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    // maxZoom: 10,
    // minZoom: 8,
  }
  newSegment_origin: string;
  newSegment_destination: string;
  drawingManager: google.maps.drawing.DrawingManager;
  shape: any;
  isMapReady: Boolean = false;


  constructor(
    private api: ApiService,
    private toaster: ToasterService,
    private Alerter: AlertService,
    public popoverController: PopoverController,
    private global: GlobalSettings,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private file: FileService
  ) {
    this.list = this.SURF_TYPE;
  }

  ngOnInit() {

    this.global.get_asses_MunicipalCoords().subscribe(async (value) => {
      this.decode_path(this.global.munic_Borderline.value);
      this.move_camera(value);
    });

    this.global.get_asses_municipality().subscribe(async (value) => {
      this.assesMunicipality = value;
    });

    this.global.get_asses_filter().subscribe(async (value) => {
      this.filterBy = value;
      this.set_filter(value)
    });

    // this.global.get_Segments().subscribe(val => {
    //   this.Segments = val;
    //   console.log('get_Segments', val)
    //   this.set_filter(this.filterBy);
    // })

    this.global.get_MUNIC().subscribe(value => {
      this.MUNIC = value;
      if (this.Segments) {
        this.Filter_segments();
      }
    })

    this.global.get_SURF_TYPE().subscribe(value => {
      this.SURF_TYPE = value;
      if (this.Segments) {
        this.Filter_segments();
      }
    })

    this.global.get_SEGMENT_STATUS().subscribe(value => {
      this.SEGMENT_STATUS = value;
      if (this.Segments) {
        this.Filter_segments();
      }
    })

    this.global.get_ASSESMENT_STATUS().subscribe(value => {
      this.ASSESMENT_STATUS = value;
      if (this.Segments) {
        this.Filter_segments();
      }
    })

    this.global.get_isDrawing().subscribe(value => {
      switch (value) {
        case true:
          this.start_drawing();
          break;
        case false:
          this.stop_drawing();
          break;

        default:
          break;
      }
    })


    this.load_map();
  }

  ngAfterViewInit() {

  }


  async presentPopover(ev: any, event) {
    String(event).substr
    const popover = await this.popoverController.create({
      component: FilterComponent,
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true,
      componentProps: {
        event: event
      },
    });
    return await popover.present();
  }

  async presentLayersPopover(ev: any, event) {
    String(event).substr
    const popover = await this.popoverController.create({
      component: LayersComponent,
      // cssClass: 'my-custom-class',
      event: ev,
      translucent: true,
      componentProps: {
        event: event
      },
    });
    return await popover.present();
  }

  async presentAddPopover(ev: any, event) {

    const popover = await this.popoverController.create({
      component: AddOptionsComponent,
      // cssClass: 'my-custom-class',
      event: ev,
      translucent: true,
      componentProps: {
        event: event
      },
    });
    return await popover.present();

  }

  /**
   * load_map
   */
  public load_map() {
    // Create a new StyledMapType object, passing it an array of styles,
    // and the name to be displayed on the map type control.
    const RetroMapStyle = new google.maps.StyledMapType(
      [
        {
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#ebe3cd"
            }
          ]
        },
        {
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#523735"
            }
          ]
        },
        {
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#f5f1e6"
            }
          ]
        },
        {
          "featureType": "administrative",
          "elementType": "geometry",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "administrative",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#c9b2a6"
            }
          ]
        },
        {
          "featureType": "administrative.land_parcel",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#dcd2be"
            }
          ]
        },
        {
          "featureType": "administrative.land_parcel",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#ae9e90"
            }
          ]
        },
        {
          "featureType": "landscape.natural",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dfd2ae"
            }
          ]
        },
        {
          "featureType": "poi",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dfd2ae"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#93817c"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#a5b076"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#447530"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#f5f1e6"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "labels.icon",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "road.arterial",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#fdfcf8"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#f8c967"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#e9bc62"
            }
          ]
        },
        {
          "featureType": "road.highway.controlled_access",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#e98d58"
            }
          ]
        },
        {
          "featureType": "road.highway.controlled_access",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#db8555"
            }
          ]
        },
        {
          "featureType": "road.local",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#806b63"
            }
          ]
        },
        {
          "featureType": "transit",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dfd2ae"
            }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#8f7d77"
            }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#ebe3cd"
            }
          ]
        },
        {
          "featureType": "transit.station",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dfd2ae"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#b9d3c2"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#92998d"
            }
          ]
        }
      ],

      { name: "Retro" }
    );

    const DarkMapStyle = new google.maps.StyledMapType(
      [
        {
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#242f3e"
            }
          ]
        },
        {
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#746855"
            }
          ]
        },
        {
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#242f3e"
            }
          ]
        },
        {
          "featureType": "administrative",
          "elementType": "geometry",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "administrative.locality",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#d59563"
            }
          ]
        },
        {
          "featureType": "poi",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#d59563"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#263c3f"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#6b9a76"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#38414e"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#212a37"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "labels.icon",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#9ca5b3"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#746855"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#1f2835"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#f3d19c"
            }
          ]
        },
        {
          "featureType": "transit",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "transit",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#2f3948"
            }
          ]
        },
        {
          "featureType": "transit.station",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#d59563"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#17263c"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#515c6d"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#17263c"
            }
          ]
        }
      ],

      { name: "Dark" }
    );

    const StandardMapStyle = new google.maps.StyledMapType(
      [
        {
          "featureType": "administrative",
          "elementType": "geometry",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "poi",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "labels.icon",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "transit",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        }
      ],

      { name: "Map" }
    );

    this.map = new google.maps.Map(document.getElementById('map_canvas'), {
      center: this.center,
      zoom: 9,
      zoomControl: true,
      mapTypeControl: true,
      fullscreenControl: true,
      styles: [{ featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] }],
      streetViewControl: true,
      mapTypeId: "hybrid",
      mapTypeControlOptions: {
        mapTypeIds: ["satellite", "hybrid", "Map", "terrain", "RetroMap", "DarkMap"],
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.RIGHT_TOP
      },
      fullscreenControlOptions: {
        position: google.maps.ControlPosition.BOTTOM_RIGHT
      }
    });

    //Associate the styled map with the MapTypeId and set it to display.
    this.map.mapTypes.set("RetroMap", RetroMapStyle);
    this.map.mapTypes.set("DarkMap", DarkMapStyle);
    this.map.mapTypes.set("Map", StandardMapStyle);

    var reverse_geocode = (latlang) => {
      this.reverse_geocode(latlang);
    }

    var set_isMapReady = (val) => {
      this.isMapReady = val;
    }


    google.maps.event.addListener(this.map, "idle", function () {
      var center = this.getCenter();
      var latitude = center.lat();
      var longitude = center.lng();
      console.log("current latitude is: " + latitude);
      console.log("current longitude is: " + longitude);
      reverse_geocode(latitude + ',' + longitude);
      set_isMapReady(true);
    });

    this.get_segments();
    // this.start_drawing();
  }





  /**
   * get_routes
   */
  public async get_routes() {
    this.api.get_file('TMH18/TMH18.rcl').subscribe(data => {

      this.routes = JSON.parse(data);

      console.log(
        this.routes
      );
    })
  }

  /**
   * move_camera
   */
  public move_camera(center) {
    this.center = center;
    // this.map.panTo(center);
    console.log('map moved to :', center)
  }

  /**
   * reverse_geocode
   */
  public reverse_geocode(latlng: string) {
    this.api.get_reverse_geocode(latlng).subscribe(res => {
      console.log(res.data.results[0].formatted_address)
      this.current_place = res.data.results[0].formatted_address;
    })
  }

  private decode_path(encodedPath) {
    // let path = google.maps.geometry.encoding.decodePath(encodedPath);
    // console.log('encodedPath:', path)



    // var geocoder = new google.maps.Geocoder();
    // geocoder.geocode({
    //   'address': "rajasthan"
    // }, (results, status) => {
    //   console.log('Results:', results[0].geometry.location);
    //   let path: any;
    //   path = results[0].geometry.location;
    //   for (let index = 0; index < path.length; index++) {

    //   }
    // })
  }

  /**
   * get_segment
   */
  public async get_segments() {

    const loading = await this.loadingCtrl.create({
      message: 'Loading segments ....'
    })

    loading.present();

    this.api.get_all_segments('', 'SortBy', 'filterBy', 'funnelBy').subscribe(async data => {
      console.log('Segment data:', data.data);

      this.Segments = data.data;
      this.results_count = data.data.length;
      loading.dismiss();


      // this.mapService.polyline_to_geojson(this.Segments[0].snap_points)


      this.Filter_segments();
    })

  }

  /**
  * Filter_segments
  */
  public async Filter_segments() {



    const loading = await this.loadingCtrl.create({
      message: 'filtering ...'
    })

    await loading.present()



    if (this.Segments.length > 0) {

      //reset counters
      for (let index = 0; index < this.MUNIC_COUNT.length; index++) {
        this.global.MUNIC_COUNT.value[index].count = 0;
      }
      for (let index = 0; index < this.SURF_TYPE_COUNT.length; index++) {
        this.global.SURF_TYPE_COUNT.value[index].count = 0;
      }
      for (let index = 0; index < this.SEGMENT_STATUS_COUNT.length; index++) {
        this.global.SEGMENT_STATUS_COUNT.value[index].count = 0;
      }
      this.clear_map();
      this.results_count = 0;
      this.segments_length = 0;

      for (let index = 0; index < this.Segments.length; index++) {

        var isSurf_type = false;
        var isMunic = false;
        var isAsses_Status = false;

        //SEGMENT_STATUS
        for (let x = 0; x < this.SEGMENT_STATUS.length; x++) {
          const SEGMENT_STATUS = this.SEGMENT_STATUS[x];
          if (SEGMENT_STATUS.level == this.Segments[index].SEGMENT_STATUS && SEGMENT_STATUS.isChecked) {
            isAsses_Status = true;
          }
        }

        //MUNIC
        for (let x = 0; x < this.MUNIC.length; x++) {
          const MUNIC = this.MUNIC[x];
          if (MUNIC.code == this.Segments[index].MUNIC && MUNIC.isChecked) {
            isMunic = true;
          }
        }

        //SURF_TYPE
        for (let x = 0; x < this.SURF_TYPE.length; x++) {
          const SURF_TYPE = this.SURF_TYPE[x];
          if (SURF_TYPE.name == this.Segments[index].SURF_TYPE && SURF_TYPE.isChecked) {
            isSurf_type = true;
          }
        }

        //Counts
        //count per assesment
        for (let i = 0; i < this.SEGMENT_STATUS_COUNT.length; i++) {
          if (this.SEGMENT_STATUS_COUNT[i].level == this.Segments[index].SEGMENT_STATUS) {
            this.global.SEGMENT_STATUS_COUNT.value[i].count++;
          }
        }

        //count per surface type
        for (let i = 0; i < this.SURF_TYPE_COUNT.length; i++) {
          if (this.SURF_TYPE_COUNT[i].code == this.Segments[index].SURF_TYPE) {
            this.global.SURF_TYPE_COUNT.value[i].count++;
          }
        }

        //count per municipality
        for (let i = 0; i < this.MUNIC_COUNT.length; i++) {
          if (this.MUNIC_COUNT[i].code == this.Segments[index].MUNIC) {
            this.global.MUNIC_COUNT.value[i].count++;
          }
        }

        if (isSurf_type && isMunic && isAsses_Status) {

          this.results_count++
          var points = this.Segments[index].snap_points;

          var id: any = this.Segments[index].SEG_ID;
          this.segments_length += this.Segments[index].length_km;
          this.draw_polyline(points, id, this.Segments[index].SEGMENT_STATUS, false)

        }
      }
    }



    await loading.dismiss();

  }

  /**
* search_segments
*/
  public async search_segments() {


    const loading = await this.loadingCtrl.create({
      message: 'searching ...'
    })

    await loading.present()



    if (this.Segments.length > 0) {

      //reset counters
      for (let index = 0; index < this.MUNIC_COUNT.length; index++) {
        this.global.MUNIC_COUNT.value[index].count = 0;
      }
      for (let index = 0; index < this.SURF_TYPE_COUNT.length; index++) {
        this.global.SURF_TYPE_COUNT.value[index].count = 0;
      }
      for (let index = 0; index < this.SEGMENT_STATUS_COUNT.length; index++) {
        this.global.SEGMENT_STATUS_COUNT.value[index].count = 0;
      }
      this.clear_map();
      this.results_count = 0;
      this.segments_length = 0;

      console.log('searchText:', this.searchText)

      for (let index = 0; index < this.Segments.length; index++) {

        var isSurf_type = false;
        var isMunic = false;
        var isAsses_Status = false;

        //SEGMENT_STATUS
        for (let x = 0; x < this.SEGMENT_STATUS.length; x++) {
          const SEGMENT_STATUS = this.SEGMENT_STATUS[x];
          if (SEGMENT_STATUS.level == this.Segments[index].SEGMENT_STATUS && SEGMENT_STATUS.isChecked) {
            isAsses_Status = true;
          }
        }

        //MUNIC
        for (let x = 0; x < this.MUNIC.length; x++) {
          const MUNIC = this.MUNIC[x];
          if (MUNIC.code == this.Segments[index].MUNIC && MUNIC.isChecked) {
            isMunic = true;
          }
        }

        //SURF_TYPE
        for (let x = 0; x < this.SURF_TYPE.length; x++) {
          const SURF_TYPE = this.SURF_TYPE[x];
          if (SURF_TYPE.name == this.Segments[index].SURF_TYPE && SURF_TYPE.isChecked) {
            isSurf_type = true;
          }
        }

        //Counts
        //count per assesment
        for (let i = 0; i < this.SEGMENT_STATUS_COUNT.length; i++) {
          if (this.SEGMENT_STATUS_COUNT[i].level == this.Segments[index].SEGMENT_STATUS) {
            this.global.SEGMENT_STATUS_COUNT.value[i].count++;
          }
        }

        //count per surface type
        for (let i = 0; i < this.SURF_TYPE_COUNT.length; i++) {
          if (this.SURF_TYPE_COUNT[i].code == this.Segments[index].SURF_TYPE) {
            this.global.SURF_TYPE_COUNT.value[i].count++;
          }
        }

        //count per municipality
        for (let i = 0; i < this.MUNIC_COUNT.length; i++) {
          if (this.MUNIC_COUNT[i].code == this.Segments[index].MUNIC) {
            this.global.MUNIC_COUNT.value[i].count++;
          }
        }

        let compString = String(this.Segments[index].SEG_ID).toLowerCase()

        if (compString.substring(0, this.searchText.length) == this.searchText.toLowerCase()) {

          this.results_count++
          var points = this.Segments[index].snap_points;

          var id: any = this.Segments[index].SEG_ID;
          this.segments_length += this.Segments[index].length_km;
          this.draw_polyline(points, id, this.Segments[index].SEGMENT_STATUS, true)

        }
      }
    }



    await loading.dismiss();

  }

  /**
   * Filter_assesments
   */
  public async Filter_assesments() {
    let munic_data: any[] = [];
    let surface_data: any[] = [];
    let segment_data: any[] = [];
    this.segments_length = 0;

    //reset counters
    for (let index = 0; index < this.MUNIC_COUNT.length; index++) {
      this.global.MUNIC_COUNT.value[index].count = 0;
    }
    for (let index = 0; index < this.SURF_TYPE_COUNT.length; index++) {
      this.global.SURF_TYPE_COUNT.value[index].count = 0;
    }
    for (let index = 0; index < this.SEGMENT_STATUS_COUNT.length; index++) {
      this.global.SEGMENT_STATUS_COUNT.value[index].count = 0;
    }
    for (let index = 0; index < this.ASSESMENT_STATUS_COUNT.length; index++) {
      this.global.ASSESMENT_STATUS_COUNT.value[index].count = 0;
    }




    const loading = await this.loadingCtrl.create({
      message: 'filtering ...'
    })

    await loading.present()

    //filter by surface type
    for (let index = 0; index < this.Segments.length; index++) {
      for (let x = 0; x < this.SURF_TYPE.length; x++) {
        const SURF_TYPE = this.SURF_TYPE[x];
        if (SURF_TYPE.name == this.Segments[index].SURF_TYPE && SURF_TYPE.isChecked) {
          surface_data.push(await this.Segments[index])
        }
      }

      //count per surface type
      for (let i = 0; i < this.SURF_TYPE_COUNT.length; i++) {
        if (this.SURF_TYPE_COUNT[i].code == this.Segments[index].SURF_TYPE) {
          this.global.SURF_TYPE_COUNT.value[i].count++;
        }
      }

      //count per municipality
      for (let i = 0; i < this.MUNIC_COUNT.length; i++) {
        if (this.MUNIC_COUNT[i].code == this.Segments[index].MUNIC) {
          this.global.MUNIC_COUNT.value[i].count++;
        }
      }
    }

    //filter by municipality
    for (let index = 0; index < surface_data.length; index++) {
      for (let x = 0; x < this.MUNIC.length; x++) {
        const MUNIC = this.MUNIC[x];
        if (MUNIC.code == surface_data[index].MUNIC && MUNIC.isChecked) {
          munic_data.push(await surface_data[index])
        }
      }
    }

    //filter by ASSESMENT_STATUS
    for (let index = 0; index < munic_data.length; index++) {
      //count per segment_status
      if (0 === munic_data[index].SEGMENT_STATUS) {
        this.global.ASSESMENT_STATUS_COUNT.value[0].count++;
      } else {
        this.global.ASSESMENT_STATUS_COUNT.value[1].count++;
      }


      if (0 === munic_data[index].SEGMENT_STATUS && this.ASSESMENT_STATUS[0].isChecked) {
        segment_data.push(await munic_data[index]);
      }

      if (0 != munic_data[index].SEGMENT_STATUS && this.ASSESMENT_STATUS[1].isChecked) {
        segment_data.push(await munic_data[index]);

      }

    }


    //finally plot
    this.clear_map();
    this.results_count = segment_data.length;

    for (let index = 0; index < segment_data.length; index++) {
      var points = segment_data[index].snap_points;

      var start_latitude = Number(segment_data[index].START_LATITUDE);
      var start_longitude = Number(segment_data[index].START_LONGITUDE);
      var end_latitude = Number(segment_data[index].END_LATITUDE);
      var end_longitude = Number(segment_data[index].END_LONGITUDE);

      var path = [
        { lat: start_latitude, lng: start_longitude },
        { lat: end_latitude, lng: end_longitude }
      ]

      var id: any = segment_data[index].SEG_ID;
      // this.segments_length += (Number(segment_data[index].END_KM)) - Number(segment_data[index].START_KM);
      this.segments_length += segment_data[index].length_km;

      //set accrodingly 0 = not asssed, 1 = assesed
      let SEGMENT_STATUS = segment_data[index].SEGMENT_STATUS;
      switch (SEGMENT_STATUS) {
        case 0:
          SEGMENT_STATUS = 0;
          break;

        default:
          SEGMENT_STATUS = 1;
          break;
      }

      this.draw_polyline(points, id, SEGMENT_STATUS, false);
    }

    await loading.dismiss();
  }

  /**
   * get_traffic_station
   */
  public async get_traffic_station() {

    const loading = await this.loadingCtrl.create({
      message: 'Loading Traffic ....'
    })

    loading.present();

    this.api.get_all_traffic_station('search', 'SortBy', 'filterBy', 'funnelBy').subscribe(data => {
      console.log('Traffic data:', (data));
      this.clear_map();
      this.Traffic_station = data.data;
      this.results_count = data.data.length;

      for (let index = 0; index < this.Traffic_station.length; index++) {
        let lat_lng = { lat: Number(data.data[index].start_latitude), lng: Number(data.data[index].start_longitude) };
        this.addMarker(lat_lng, data.data[index].station_no, 'traffic', data.data[index].status)
      }

      loading.dismiss();
    })

  }

  /**
   * get_polyline
   */
  public get_polyline(points): any {
    this.api.get_snap_points(points).subscribe(res => {
      console.log(res);
      return res;
    })
  }

  /**
   * open_info_windows
   */
  public open_info_windows(atrifact_image, marker) {
    if (infowindow) {
      infowindow.close();
    }

    const contentString =
      '<div id="content">' +
      '<div id="siteNotice">' +
      "</div>" +

      '<h1 id="firstHeading" class="firstHeading">Artifact</h1>' +
      '<div id="bodyContent">' +
      "<img style='height:200px;' src='" + atrifact_image + "' />" +

      "<p><b>block_crack :</b>, {count: 33,sqm:2.3 }<br>" +
      "<p><b>longitudinal_crack :</b>, {count: 32,sqm:3.2}<br>" +
      "<p><b>transverse_crack :</b>, {count: 43,sqm:4.5}<br>" +
      "<p><b>crocodile_crack :</b>, {count: 33,sqm:2.3 }<br>" +
      "<p><b>patches :</b>, {count: 0,sqm:0}<br>" +
      "<p><b>pothole :</b>, {count: 0,sqm:0}<br>" +

      "</p>" +

      "</div>" +
      "</div>";

    var infowindow = new google.maps.InfoWindow({
      content: contentString
    });

    infowindow.open(this.map, marker);

  }





  /**
   * start_drawing
   */
  public start_drawing() {
    console.log('Start drawing')
    var coordinates = [];
    this.drawingManager = new google.maps.drawing.DrawingManager({
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
          // google.maps.drawing.OverlayType.MARKER,
          // google.maps.drawing.OverlayType.CIRCLE,
          // google.maps.drawing.OverlayType.POLYGON,
          google.maps.drawing.OverlayType.POLYLINE,
          // google.maps.drawing.OverlayType.RECTANGLE
        ]
      }
    });

    this.drawingManager.setMap(this.map);

    var secondMethod = (shape) => {
      this.shape = shape;
      this.snap_points(coordinates, this.drawingManager);
    }

    google.maps.event.addListener(this.drawingManager, 'polylinecomplete', function (line) {
      var polygonBounds = line.getPath();
      var shape = line;

      for (var i = 0; i < polygonBounds.length; i++) {
        coordinates.push(polygonBounds.getAt(i).lat() + "," + polygonBounds.getAt(i).lng());
      }

      secondMethod(shape);
    })

  }

  /**
   * stop_drawing
   */
  public stop_drawing() {
    this.drawingManager.setMap(null);
    let polyline: google.maps.Polyline = this.polyline[this.polyline.length - 1];
    this.shape.setMap(null);
    this.shape = null;
    polyline.setMap(null);

  }


  async snap_points(points, drawingManager) {
    var path = '';

    for (let index = 0; index < points.length; index++) {
      if (index == points.length - 1) {
        path += await points[index]
      } else {
        path += await points[index] + '|';
      }
    }

    this.api.get_nearest_roads(path).subscribe(response => {
      console.log('Nearest road:', response)
    })

    this.api.get_snap_points(path).subscribe(async res => {

      // console.log('snappoints:', res)
      var path = res.snappedPoints;
      var points: any[] = [];

      for (let index = 0; index < path.length; index++) {
        let latlng = new google.maps.LatLng(path[index].location.latitude, path[index].location.longitude);
        points.push(latlng);
      }



      var set_snapped_points = () => {
        let encodedPath = google.maps.geometry.encoding.encodePath(points)
        console.log('Endcoded path:', encodedPath);
        this.snapped_points = encodedPath;
        this.newSegment_origin = path[0].location.latitude + ',' + path[0].location.longitude;
        this.newSegment_destination = path[path.length - 1].location.latitude + ',' + path[path.length - 1].location.longitude
        this.get_distance(this.newSegment_origin, this.newSegment_destination);
        this.draw_polyline(encodedPath, '', '', false);

      }

      set_snapped_points();

    })
  }

  public async draw_polyline(path, id, status, is_search) {
    var color;
    switch (status) {
      case 0:
        color = '#4B0082';
        break;
      case 1:
        color = '#0583F2';
        break;
      case 2:
        color = '#2dd36f';
        break;
      case 3:
        color = '#F2C849';
        break;
      case 4:
        color = '#F27405';
        break;
      case 5:
        color = '#eb445a';
        break;

      default:
        color = '#4B0082';
        break;
    }



    let polyline = new google.maps.Polyline({
      path: google.maps.geometry.encoding.decodePath(path),
      geodesic: true,
      strokeColor: color,
      strokeOpacity: 1.0,
      strokeWeight: 4,
      map: this.map
    });

    this.polyline.push(polyline)

    polyline.addListener("click", async () => {
      const modal = await this.modalCtrl.create({
        component: InfoModalPage,
        componentProps: {
          'segment_id': id
        },
        cssClass: 'infoModalClass'
      })

      await modal.present();
    });

    var infoWindow = new google.maps.InfoWindow();

    // Open the InfoWindow on mouseover:
    google.maps.event.addListener(polyline, 'mouseover', function (e) {
      infoWindow.setPosition(e.latLng);
      infoWindow.setContent(id);
      infoWindow.open(this.map);
    });

    // Close the InfoWindow on mouseout:
    google.maps.event.addListener(polyline, 'mouseout', function () {
      infoWindow.close();
    });

    polyline.setMap(this.map);

    if (is_search) {
      var bounds = new google.maps.LatLngBounds();
      var coordinates = google.maps.geometry.encoding.decodePath(path)
      for (var i = 0; i < coordinates.length; i++) {
        bounds.extend(coordinates[i]);
      }
      this.map.fitBounds(bounds);
    }


  }

  /**
   * get_distance
   */
  public async get_distance(origin1, destinationA) {
    var km;
    const toast = await this.toastCtrl.create({
      header: 'Add new segment ?',
      message: 'click to add',
      position: 'top',
      buttons: [
        {
          side: 'start',
          icon: 'close',
          handler: () => {
            this.global.set_isDrawing(false);
          }
        }, {
          text: 'Add',
          handler: () => {
            this.add_segment();
          }
        }
      ]
    })
    var setDistance = () => {
      toast.present();
      this.distance = km;
    }

    // var origin1 = new google.maps.LatLng(55.930385, -3.118425);
    // var origin2 = 'Greenwich, England';
    // var destinationA = 'Stockholm, Sweden';
    // var destinationB = new google.maps.LatLng(50.087692, 14.421150);

    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [origin1],
        destinations: [destinationA],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false,
      }, callback);

    function callback(response, status) {
      // console.log(response.rows[0].elements[0].distance.value)

      km = response.rows[0].elements[0].distance.value;
      km /= 1000;
      setDistance();
      // console.log(km)

    }
  }

  /**
   * add_segment
   */
  public async add_segment() {
    const modal = await this.modalCtrl.create({
      component: AddSegmentPage,
      componentProps: {
        distance: this.distance,
        snapped_points: this.snapped_points,
        start_coords: this.newSegment_origin,
        end_coords: this.newSegment_destination
      }
    })

    return modal.present()
  }


  addMarker(location, id, feature, status) {

    var icon;

    if (status == 1) {
      icon = {
        url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
        strokeColor: "white",
      }
    } else {
      icon = {
        url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
        strokeColor: "white"
      }
    }

    const marker = new google.maps.Marker({
      position: location,
      map: this.map,
      icon: icon
    });

    this.marker.push(marker);

    switch (feature) {
      case 'traffic':
        marker.addListener("click", async () => {
          const modal = await this.modalCtrl.create({
            component: InfoModalPage,
            componentProps: {
              traffic_station_id: id
            }
          })
          return modal.present();
        });
        break;

      case 'structure':
        marker.addListener("click", async () => {
          const modal = await this.modalCtrl.create({
            component: InfoModalPage,
            componentProps: {
              structure_id: id
            }
          })
          return modal.present();
        });
        break;

      case 'furniture':
        marker.addListener("click", async () => {
          const modal = await this.modalCtrl.create({
            component: InfoModalPage,
            componentProps: {
              furniture_id: id
            }
          })
          return modal.present();
        });
        break;

      default:
        break;
    }

  }

  /**
   * clear_map
   */
  public clear_map() {

    if (this.polyline && this.polyline.length > 0) {
      //clear segments
      for (let index = 0; index < this.polyline.length; index++) {
        let polyline: google.maps.Polyline = this.polyline[index];
        polyline.setMap(null);
      }
    }

    if (this.marker && this.marker.length > 0) {
      //clear traffic
      for (let index = 0; index < this.marker.length; index++) {
        let marker: google.maps.Marker = this.marker[index];
        marker.setMap(null);
      }
    }

    this.results_count = 0;
  }

  /**
   * get_furniture
   */
  public async get_furniture() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading furnitures ...'
    })

    loading.present();

    this.api.get_all_furniture().subscribe(data => {
      loading.dismiss();
      console.log('Furniture:', data)

      this.clear_map();

      this.Furniture = data.data;
      this.results_count = data.rows;

      for (let index = 0; index < this.Furniture.length; index++) {
        let lat_lng = { lat: Number(data.data[index].start_latitude), lng: Number(data.data[index].start_longitude) };
        this.addMarker(lat_lng, data.data[index].id, 'furniture', 0)
      }

    })
  }

  /**
   * get_structure
   */
  public async get_structure() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading structures ...'
    })

    loading.present();

    this.api.get_all_structure().subscribe(data => {
      loading.dismiss();
      console.log('Structure:', data)
      this.clear_map();

      this.Structure = data.data;
      this.results_count = this.Structure.length;

      for (let index = 0; index < this.Structure.length; index++) {
        let lat_lng = { lat: Number(data.data[index].start_latitude), lng: Number(data.data[index].start_longitude) };
        this.addMarker(lat_lng, data.data[index].id, 'structure', 0);
      }
    })
  }

  /**
   * get_assesments
   */
  public async get_assesments() {
    // const loading = await this.loadingCtrl.create({
    //   message: 'Loading segments ....'
    // })

    // loading.present();

    // this.api.get_all_segments('', 'SortBy', 'filterBy', 'funnelBy').subscribe(data => {
    //   console.log('Segment data:', data.data);
    //   this.Segments = data.data;
    //   this.results_count = data.data.length;
    //   loading.dismiss();

    this.Filter_assesments();
    // })
  }

  set_filter(filterBy) {

    if (this.isMapReady == false) {
      return;
    }

    switch (filterBy) {
      case 'Segments':
        this.get_segments();

        // this.Filter_segments();
        console.log('Segments');
        break;

      case 'Traffic':
        this.get_traffic_station();
        console.log('Traffic')
        break;

      case 'Structures':
        this.get_structure();
        console.log('Structures');
        break;

      case 'Furniture':
        this.get_furniture();
        console.log('Furniture');
        break;

      case 'Assements':
        this.get_assesments();
        console.log('Assements');
        break;

      default:
        break;
    }
  }

  async convert_to_shap(geojson) {
    shpwrite.download(geojson, {
    })
  }

  async convert_to_kml() {

    const loading = await this.loadingCtrl.create({
      message: 'generating kml file ....'
    })

    await loading.present();


    //start
    let kml = `<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2"><Document>`

    for (let x = 0; x < this.Segments.length; x++) {

      const segment = this.Segments[x];
      let poly = segment.snap_points;
      const geo = await polyline.toGeoJSON(poly);
      let type = geo.type;
      var color;
      switch (segment.SEGMENT_STATUS) {
        case 0:
          color = '4b0082ff';
          break;
        case 1:
          color = '0583f2ff';
          break;
        case 2:
          color = '2dd36fff';
          break;
        case 3:
          color = 'f2c849ff';
          break;
        case 4:
          color = 'f27405ff';
          break;
        case 5:
          color = 'eb445aff';
          break;
        default:
          color = '4b0082ff';
          break;
      }

      let coordinates = '';
      for (let y = 0; y < geo.coordinates.length; y++) {
        const c = geo.coordinates[y];
        coordinates += `${c[0]},${c[1]} `;
      }
      kml += `<Placemark id="${segment.SEG_ID}"><description><![CDATA[<table border=1><tr><td>SEG_ID</td><td>${segment.SEG_ID}</td></tr><tr><td>DISTRICT:  </td><td>${segment.DISTRICT}</td></tr><tr><td>MUNIC:  </td><td>${segment.MUNIC}</td></tr><tr><td>START_KM</td><td>${segment.START_KM}</td></tr><tr><td>END_KM</td><td>${segment.END_KM}</td></tr><tr><td>SURF_TYPE</td><td>${segment.SURF_TYPE}</td></tr></table>]]></description><Style><LineStyle><color>${color}</color><width>8</width></LineStyle></Style><ExtendedData></ExtendedData><${type}><coordinates>${coordinates}</coordinates></${type}></Placemark>`
    }

    //end
    kml += `</Document></kml>`;

    this.file.exportAsKmlFile(kml, 'GSDM segments');
    await loading.dismiss();
    // this.convert_to_shap(geojson[0]);

    // console.log('polyline_to_geojson', geojson)
    // console.log('kml:', kml)
  }

  async get_kml(geojson) {
    let kml = await tokml(geojson, {
      name: 'name',
      description: 'description'
    });
    return kml;
  }

  async get_geojson() {
    let geojson: object[] = [];
    for (let index = 0; index < this.Segments.length; index++) {
      const segment = this.Segments[index];
      let p = segment.snap_points;
      //pushing p
      geojson.push(polyline.toGeoJSON(p));
    }
    return geojson;
  }
}
