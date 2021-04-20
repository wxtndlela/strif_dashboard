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

    this.get_routes();


  }

  routes: any[];
  public mapHeight = 70;
  private map;

  zoom: 8;
  center: any;
  options: google.maps.MapOptions = {
    mapTypeId: 'hybrid',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    // maxZoom: 15,
    // minZoom: 8,
  }

  public Parcels: any = [];
  public results_count = 0;
  public searchText = '';
  public filterBy: String = '';
  public municipalities: String = '';
  atrifact_image = "../../../assets/avater-default.png";

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

    const contentString =
    '<div id="content">' +
    '<div id="siteNotice">' +
    "</div>" +
    
    '<h1 id="firstHeading" class="firstHeading">Uluru</h1>' +
    '<div id="bodyContent">' +
    "<img style='height:200px;' src='"+this.atrifact_image+"' />" +

    "<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large " +
    "sandstone rock formation in the southern part of the " +
    "Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) " +
    "south west of the nearest large town, Alice Springs; 450&#160;km " +
    "(280&#160;mi) by road. Kata Tjuta and Uluru are the two major " +
    "features of the Uluru - Kata Tjuta National Park. Uluru is " +
    "sacred to the Pitjantjatjara and Yankunytjatjara, the " +
    "Aboriginal people of the area. It has many springs, waterholes, " +
    "rock caves and ancient paintings. Uluru is listed as a World " +
    "Heritage Site.</p>" +
    '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">' +
    "https://en.wikipedia.org/w/index.php?title=Uluru</a> " +
    "(last visited June 22, 2009).</p>" +
    "</div>" +
    "</div>";


    let marker = new google.maps.Marker({
      position: this.center,
      map: this.map,
			title: 'Golden Gate Bridge',
      icon: {
        url : './assets/markercluster/small.png',
        size: new google.maps.Size(20, 32),
      },
    });

    const infowindow = new google.maps.InfoWindow({
      content: contentString,
    });
    marker.addListener("click", () => {
      infowindow.open(this.map, marker);
    });


    // for (let i = 0; i < this.routes.length; i++) {
    //   let DISTRICT = 'Gert Sibande';
    //   let path = [];

    //   path.push(
    //     {
    //       lat: Number(this.routes[i].START_LATITUDE),
    //       lng: Number(this.routes[i].START_LONGITUDE)
    //     }
    //   );

    //   path.push(
    //     {
    //       lat: Number(this.routes[i].END_LATITUDE),
    //       lng: Number(this.routes[i].END_LONGITUDE)
    //     }
    //   )

    //   // console.log('DISTRICT:', this.routes[i].DISTRICT)


    //   // const polyline = new google.maps.Polyline({
    //   //   path: path,
    //   //   geodesic: true,
    //   //   strokeColor: "#FF0000",
    //   //   strokeOpacity: 1.0,
    //   //   strokeWeight: 2,
    //   //   map:map
    //   // });

    //   // polyline.setMap(map);

    // }

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

      this.load_map();
      this.get_roads();

    })
  }

  /**
   * get_roads
   */
  public get_roads() {
    this.api.get_nearest_roads('60.170880,24.942795|60.170879,24.942796|60.170877,24.942796').subscribe(data => {

      var path = (JSON.parse(data)).snappedPoints;
      var coords = [];
      console.log(path)

      for (let x = 0; x < path.length; x++) {
        coords.push({ lat: path[x].location.latitude, lng: path[x].location.longitude });
      }

      const polyline = new google.maps.Polyline({
        path: coords,
        geodesic: true,
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 2,
        map: this.map
      });



    })
  }



}
