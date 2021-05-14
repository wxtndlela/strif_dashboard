import { Component, OnInit, AfterViewInit } from '@angular/core';
// import { GoogleMap, GoogleMapsModule } from '@angular/google-maps'
import { ApiService } from '../../services/api.service';
import { AlertService } from '../../services/alert.service';
import { ToasterService } from '../../services/toaster.service';
import { PopoverController, ModalController, ToastController, LoadingController } from '@ionic/angular';
import { FilterComponent } from '../components/filter/filter.component';
import { GlobalSettings } from '../../services/global.service';
import { AddSegmentPage } from '../add-segment/add-segment.page';

@Component({
  selector: 'app-assesments',
  templateUrl: './assesments.page.html',
  styleUrls: ['./assesments.page.scss'],
})

export class AssesmentsPage implements OnInit {

  constructor(
    private api: ApiService,
    private toaster: ToasterService,
    private Alerter: AlertService,
    public popoverController: PopoverController,
    private global: GlobalSettings,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private loadingCtrl : LoadingController
  ) {
  }

  ngOnInit() {
    this.global.get_asses_municipality().subscribe(async (value) => {
      this.municipalities = await value;
    });
    this.global.get_asses_filter().subscribe(async (value) => {
      this.filterBy = await value;
      if (value != 'pothole') {
        // this.marker = [];
        // this.marker[0] = new google.maps.Marker({
        //   position: { lat: -25.999168, lng: 28.128191 },
        //   map: this.map
        // });
        // this.marker[0].addListener("click", () => {
        //   let atrifact_image = "../../../assets/artifacts/DJI_0945.JPG";
        //   this.open_info_windows(atrifact_image, this.marker)
        // });

        this.marker[0].setMap(null);
      }

    });

    this.global.get_asses_MunicipalCoords().subscribe(async (value) => {
      this.center = value;
    });

    this.load_map();

  }

  routes: any[];
  public mapHeight = 70;
  private map;
  private marker: any[] = [];

  zoom: 18;
  center: any;
  options: google.maps.MapOptions = {
    mapTypeId: 'hybrid',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    maxZoom: 10,
    minZoom: 8,
  }

  public Parcels: any = [];
  public results_count = 0;
  public searchText = '';
  public filterBy: String = '';
  public municipalities: String = '';
  private Segments: any = [];
  atrifact_image = "../../../assets/artifacts/DJI_0940.JPG";

  private distance = 0;
  private road_name = '';
  private snapped_points: any[] = [];
  private polyline: any;

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

  /**
   * load_map
   */
  public load_map() {
    this.map = new google.maps.Map(document.getElementById('map_canvas'), {
      center: this.center,
      zoom: 15
    });

    var atrifact_image = '';

    this.marker[0] = new google.maps.Marker({
      position: { lat: -25.999168, lng: 28.128191 },
      map: this.map
    });
    this.marker[0].addListener("click", () => {
      atrifact_image = "../../../assets/artifacts/DJI_0945.JPG";
      this.open_info_windows(atrifact_image, this.marker)
    });

    this.marker[0].setMap(this.map);

    this.addMarker({ lat: -25.999168, lng: 28.128191 });

    let marker1 = new google.maps.Marker({
      position: { lat: -25.999168, lng: 28.128191 },
      map: this.map
    });
    let marker2 = new google.maps.Marker({
      position: { lat: -25.998546, lng: 28.127063 },
      map: this.map
    }); let marker3 = new google.maps.Marker({
      position: { lat: -25.998628, lng: 28.127229 },
      map: this.map
    }); let marker4 = new google.maps.Marker({
      position: { lat: -25.998729, lng: 28.127417 },
      map: this.map
    }); let marker5 = new google.maps.Marker({
      position: { lat: -25.998864, lng: 28.127680 },
      map: this.map
    }); let marker6 = new google.maps.Marker({
      position: { lat: -25.999028, lng: 28.127975 },
      map: this.map
    }); let marker7 = new google.maps.Marker({
      position: { lat: -25.999158, lng: 28.128200 },
      map: this.map
    });


    marker1.addListener("click", () => {
      atrifact_image = "../../../assets/artifacts/DJI_0945.JPG";
      this.open_info_windows(atrifact_image, marker1)
    });
    marker2.addListener("click", () => {
      atrifact_image = "../../../assets/artifacts/DJI_0944.JPG";
      this.open_info_windows(atrifact_image, marker2)
    });
    marker3.addListener("click", () => {
      atrifact_image = "../../../assets/artifacts/DJI_0943.JPG";
      this.open_info_windows(atrifact_image, marker3)
    });
    marker4.addListener("click", () => {
      atrifact_image = "../../../assets/artifacts/DJI_0940.JPG";
      this.open_info_windows(atrifact_image, marker4)
    });
    marker5.addListener("click", () => {
      atrifact_image = "../../../assets/artifacts/DJI_0942.JPG";
      this.open_info_windows(atrifact_image, marker5)
    });
    marker6.addListener("click", () => {
      atrifact_image = "../../../assets/artifacts/DJI_0941.JPG";
      this.open_info_windows(atrifact_image, marker6)
    });
    marker7.addListener("click", () => {
      atrifact_image = "../../../assets/artifacts/DJI_0940.JPG";
      this.open_info_windows(atrifact_image, marker7)
    });

    var path = [
      { lat: -25.999168, lng: 28.128191 },
      { lat: -25.999158, lng: 28.128200 }
    ]

    const polyline = new google.maps.Polyline({
      path: [
        { lat: -25.998444, lng: 28.126918 },
        { lat: -25.998782, lng: 28.127535 },
        { lat: -25.999163, lng: 28.128189 }
      ],
      geodesic: true,
      strokeColor: "#2dd36f",
      strokeOpacity: 1.0,
      strokeWeight: 4,
      map: this.map
    });

    polyline.setMap(this.map);

    this.get_segments();

    this.start_drawing()

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
   * get_segment
   */
  public async get_segments() {

    const loading = await this.loadingCtrl.create({
      message: 'Loading segments ....'
    })

    loading.present();

    this.api.get_all_segments('search', 'SortBy', 'filterBy', 'funnelBy').subscribe(data => {
      // console.log('Segment data:', JSON.parse(data.data[4].snap_points));
      this.Segments = data.data;
      loading.dismiss();

      for (let index = 0; index < this.Segments.length; index++) {
        var points = JSON.parse(this.Segments[index].snap_points);
        var path: any[] = [];
        // console.log('snap_points:', points)

        if (points) {
          for (let i = 0; i < points.length; i++) {
            path.push(points[i])
            this.draw_polyline(path)
          }
        }
      }


      // for (let index = 0; index < segment.length; index++) {
      //   console.log(segment)
      // }
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

      console.log('res:',res)
      var path = res.snappedPoints;
      var points: any[] = [];

      for (let index = 0; index < path.length; index++) {
        points.push({ lat: await path[index].location.latitude, lng: await path[index].location.longitude });
      }

      var set_snapped_points = () => {
        this.snapped_points = points;
      }

      set_snapped_points();

      this.draw_polyline(points);
      // drawingManager.setDrawingMode(null);
      let origin = await path[0].location.latitude + ',' + path[0].location.longitude;
      let destination = await path[path.length - 1].location.latitude + ',' + path[path.length - 1].location.longitude
      this.get_distance(origin, destination);

    })
  }

  public async draw_polyline(path) {

    this.polyline = new google.maps.Polyline({
      path: path,
      geodesic: true,
      strokeColor: "#AE60A6",
      strokeOpacity: 1.0,
      strokeWeight: 4,
      map: this.map
    });

    this.polyline.setMap(this.map);
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
      console.log(km)
      // See Parsing the Results for
      // the basics of a callback function.
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

  setMapOnAll(map: google.maps.Map | null) {
    // for (let i = 0; i < markers.length; i++) {
    //   markers[i].setMap(map);
    // }
  }

  addMarker(location) {
    const marker = new google.maps.Marker({
      position: location,
      map: this.map,
    });
    this.marker.push(marker);
  }



}
