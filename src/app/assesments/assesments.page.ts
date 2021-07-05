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

@Component({
  selector: 'app-assesments',
  templateUrl: './assesments.page.html',
  styleUrls: ['./assesments.page.scss'],
})

export class AssesmentsPage implements OnInit {

  Traffic_station: any;
  public Parcels: any = [];
  public results_count = 0;
  public searchText = '';
  public filterBy: String = '';
  public assesMunicipality: String = '';
  private Segments: any = [];
  atrifact_image = "../../../assets/artifacts/DJI_0940.JPG";
  public list = [];
  public SURF_TYPE = [
    {
      name: 'BLOCK',
      isChecked: true,
      borderline: '!4m5!3m4!1s0x1eeb8d69cec5c3e7:0x6f0a14c21c7465bd!8m2!3d-26.5470697!4d29.9740534'
    },
    {
      name: 'FLEX',
      isChecked: true
    },
    {
      name: 'GRAV',
      isChecked:true
    },
    
  ];

  private distance = 0;
  public segments_length: any = 0;
  private road_name = '';
  private snapped_points: any[] = [];
  private polyline: any[] = [];

  routes: any[];
  public mapHeight = 70;
  private map;
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

  constructor(
    private api: ApiService,
    private toaster: ToasterService,
    private Alerter: AlertService,
    public popoverController: PopoverController,
    private global: GlobalSettings,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {
    this.list = this.SURF_TYPE

  }

  ngOnInit() {

    this.global.get_asses_municipality().subscribe(async (value) => {
      this.assesMunicipality = value;
    });

    this.global.get_asses_MunicipalCoords().subscribe(async (value) => {
      this.decode_path(this.global.munic_Borderline.value);

      this.move_camera(value);
    });

    this.global.get_asses_filter().subscribe(async (value) => {

      this.filterBy = value;
      this.clear_map();

      switch (value) {
        case 'Segments':
          this.get_segments();
          console.log('Segments');

          break;
        case 'Traffic':
          this.get_traffic_station();

          console.log('Traffic')
          break;

        case 'Structures':
          // this.get_segments();
          console.log('Structures');
          break;

        case 'Furniture':
          // this.get_segments();
          console.log('Furniture');
          break;

        default:
          break;
      }


    });



    this.load_map();
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
    String(event).substr
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

    this.map = new google.maps.Map(document.getElementById('map_canvas'), {
      center: this.center,
      zoom: 9,
      fullscreenControl: false,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      styles: [
        {
          "featureType": "administrative",
          "elementType": "geometry.stroke",
          "stylers": [
            { "visibility": "on" },
            { "weight": 2.5 },
            { "color": "#eb445a" }
          ]
        },
        {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [
            { "visibility": "on" }
          ]
        }
      ]
    });

    this.start_drawing();
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
    this.map.panTo(center);
    console.log('map moved to :', center)
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

    this.api.get_all_segments('', 'SortBy', 'filterBy', 'funnelBy').subscribe(data => {
      console.log('Segment data:', data.data[4].START_KM);
      this.Segments = data.data;
      this.results_count = data.data.length;
      loading.dismiss();

      for (let index = 0; index < this.Segments.length; index++) {
        var points = JSON.parse(this.Segments[index].snap_points);
        var path: any[] = [];
        var id: any = this.Segments[index].id;
        this.segments_length += Math.round(this.Segments[index].START_KM);
        this.segments_length += Math.round(this.Segments[index].END_KM);


        if (points) {
          for (let i = 0; i < points.length; i++) {
            path.push(points[i])
            this.draw_polyline(path, id, this.Segments[index].SEGMENT_STATUS)
          }
        }
      }

    })

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

      this.Traffic_station = data.data;
      this.results_count = data.data.length;

      for (let index = 0; index < this.Traffic_station.length; index++) {
        let lat_lng = { lat: Number(data.data[index].start_latitude), lng: Number(data.data[index].start_longitude) };
        this.addMarker(lat_lng, data.data[index].station_no)
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
    var coordinates = [];
    var drawingManager = new google.maps.drawing.DrawingManager({
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

    var secondMethod = () => {
      this.snap_points(coordinates, drawingManager);
    }

    google.maps.event.addListener(drawingManager, 'polylinecomplete', function (line) {
      var polygonBounds = line.getPath();

      for (var i = 0; i < polygonBounds.length; i++) {
        coordinates.push(polygonBounds.getAt(i).lat() + "," + polygonBounds.getAt(i).lng());
      }

      secondMethod();
    })

    drawingManager.setMap(this.map);
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

      console.log('res:', res)
      var path = res.snappedPoints;
      var points: any[] = [];

      for (let index = 0; index < path.length; index++) {
        points.push({ lat: await path[index].location.latitude, lng: await path[index].location.longitude });
      }

      var set_snapped_points = () => {
        this.snapped_points = points;
      }

      set_snapped_points();

      this.draw_polyline(points, '', '');
      // drawingManager.setDrawingMode(null);
      let origin = await path[0].location.latitude + ',' + path[0].location.longitude;
      let destination = await path[path.length - 1].location.latitude + ',' + path[path.length - 1].location.longitude
      this.get_distance(origin, destination);

    })
  }

  public async draw_polyline(path, id, status) {
    var color;
    if (status == '1') {
      color = "#2dd36f";
    } else if (status = '8') {
      color = "#AE60A6";
    } else {
      color = "#F2C849"
    }

    let polyline = new google.maps.Polyline({
      path: path,
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

    polyline.setMap(this.map);
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
            console.log('Favorite clicked');
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
        start_coords: { lat: this.snapped_points[0].lat, lng: this.snapped_points[0].lng },
        end_coords: { lat: this.snapped_points[this.snapped_points.length - 1].lat, lng: this.snapped_points[this.snapped_points.length - 1].lng }
      }
    })

    return modal.present()
  }


  addMarker(location, traffic_station_id) {

    const marker = new google.maps.Marker({
      position: location,
      map: this.map,
    });

    this.marker.push(marker);

    marker.addListener("click", async () => {

      const modal = await this.modalCtrl.create({
        component: InfoModalPage,
        componentProps: {
          traffic_station_id: traffic_station_id
        }
      })

      return modal.present();
    });
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



}
