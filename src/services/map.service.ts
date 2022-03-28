import { Injectable } from "@angular/core";
import '../assets/js/map.service';

declare var poly2geo: any;

@Injectable()
export class MapService {
    segments: any[] = [];

    constructor(

    ) { }

    polyline_to_geojson(encodedPolyline) {
        console.log('polyline_to_geojson', poly2geo.decode(encodedPolyline))
    }
}