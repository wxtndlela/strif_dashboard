import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { NavController , ModalController} from "@ionic/angular";

@Injectable()
export class AuthService {

    constructor(
        private http: HttpClient,
        private api: ApiService,
        private router: Router,
        private navCtrl: NavController,
        public modalController: ModalController,
    ) {

    }

    //login
    login(email, password) {
        return this.http.post<any>(this.api._Url + '/auth/login', { email, password });
    }

    auth(uuid, user_role): void {
        localStorage.setItem('uuid', uuid);
        localStorage.setItem('user_role', user_role);

        // if(user_role == 'c'){
        //     this.navCtrl.navigateRoot(["client"]);
        // }

        // if(user_role == 'd'){
        //     this.navCtrl.navigateRoot(["driver"]);
        // }

        // if(user_role == 'a'){
        //     this.navCtrl.navigateRoot(["dashboard"]);
        // }

        // if(user_role == null){
        //     this.navCtrl.navigateRoot(["home"]);
        // }

        this.navCtrl.navigateRoot(["users"]);

    }

    isLoggedin(): Boolean {
        if (localStorage.getItem('uuid')) {
            return true;
        } else {
            return false;
        }
    }

    checkAuthCookie() {
        return this.http.post<any>(this.api._Url + '/auth/checkAuthCookie', {});
    }

    logout() {
        localStorage.removeItem('uuid');
        localStorage.removeItem('user_role');
        this.navCtrl.navigateRoot('');
        //return this.http.post<any>(this.api._Url + '/auth/logout', { });
    }
}
