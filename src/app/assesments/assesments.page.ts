import { Component, OnInit, AfterViewInit } from '@angular/core';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps'
import { ApiService } from '../../services/api.service';
import { AlertService } from '../../services/alert.service';
import { ToasterService } from '../../services/toaster.service';
import { PopoverController } from '@ionic/angular';
import { FilterComponent } from '../components/filter/filter.component';
import { GlobalSettings } from '../../services/global.service';

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
  ) {
  }

  ngOnInit() {
    this.global.get_asses_municipality().subscribe(async (value) => {
      this.municipalities = await value;
    });
    this.global.get_asses_filter().subscribe(async (value) => {
      this.filterBy = await value;
    });

    this.global.get_asses_MunicipalCoords().subscribe(async (value) => {
      this.center = value;
    });

    this.load_map();

  }

  routes: any[];
  public mapHeight = 70;
  private map;

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
  atrifact_image = "../../../assets/artifacts/DJI_0940.JPG";

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


  }

  /**
   * get_routes
   */
  public get_routes() {
    this.api.get_file('TMH18/TMH18.rcl').subscribe(data => {

      this.routes = JSON.parse(data);

      console.log(
        this.routes
      );

      this.get_roads();

    })
  }

  /**
   * get_roads
   */
  public get_roads() {
    this.api.get_segment(2).subscribe(data => {

      var path = [
        { lat: -25.999168, lng: 28.128191 },
        { lat: -25.999158, lng: 28.128200 }
      ]



      const polyline = new google.maps.Polyline({
        path: path,
        geodesic: true,
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 2,
        map: this.map
      });



    })
  }

  /**
   * get_polyline
   */
  public get_polyline(points): any {
    this.api.get_nearest_roads(points).subscribe(res => {
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



}
