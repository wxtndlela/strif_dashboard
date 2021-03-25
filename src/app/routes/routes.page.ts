import { Component, OnInit } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps'

@Component({
  selector: 'app-routes',
  templateUrl: './routes.page.html',
  styleUrls: ['./routes.page.scss'],
})
export class RoutesPage implements OnInit {

  constructor(
    private googleMap : GoogleMapsModule
  ) { }

  ngOnInit() {
  }

  zoom;
  center;
  options;

}
