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


    for (let i = 0; i < this.routes.length; i++) {
      let DISTRICT = 'Gert Sibande';
      let path = [];

      path.push(
        {
          lat: Number(this.routes[i].START_LATITUDE),
          lng: Number(this.routes[i].START_LONGITUDE)
        }
      );

      path.push(
        {
          lat: Number(this.routes[i].END_LATITUDE),
          lng: Number(this.routes[i].END_LONGITUDE)
        }
      )

      // console.log('DISTRICT:', this.routes[i].DISTRICT)


      // const polyline = new google.maps.Polyline({
      //   path: path,
      //   geodesic: true,
      //   strokeColor: "#FF0000",
      //   strokeOpacity: 1.0,
      //   strokeWeight: 2,
      //   map:map
      // });

      // polyline.setMap(map);

    }

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
        coords.push( { lat: path[x].location.latitude, lng: path[x].location.longitude });
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
