import { Injectable } from "@angular/core";
import { ApiService } from '../services/api.service';

@Injectable()
export class Base64Service {

    constructor(
        private api: ApiService,
    ) { }

    /**
     * convert_base64
     */
    public convert_base64(file_path) {
        let me = this;
        let file = event.target.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            //me.modelvalue = reader.result;
            console.log(reader.result);
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    }
}