import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import firebase from 'firebase';
import { LoadingController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})

export class FirebaseService {

    constructor() {
        // Initialize default app
        // Retrieve your own options values by adding a web app on
        // https://console.firebase.google.com
        firebase.initializeApp(environment.firebaseConfig);
    }

    //convert to base64
    encodeImageUri(imageUri, callback) {
        var c = document.createElement('canvas');
        var ctx = c.getContext("2d");
        var img = new Image();
        img.onload = function () {
            var aux: any = this;
            c.width = aux.width;
            c.height = aux.height;
            ctx.drawImage(img, 0, 0);
            var dataURL = c.toDataURL("image/jpeg");
            callback(dataURL);
        };
        img.src = imageUri;
    };

    //Upload profile picture to firebase
    uploadImage(imageURI) {
        return new Promise<any>((resolve, reject) => {
            let storageRef = firebase.storage().ref();
            let randomId = localStorage.getItem("uuid");
            let imageRef = storageRef.child('images/avaters').child(randomId);
            imageRef.putString(imageURI, 'data_url')
                .then(snapshot => {
                    snapshot.ref.getDownloadURL()
                        .then(res => resolve(
                            res
                        ))
                }, err => {
                    reject(err);
                })
        })
    }

    //Upload profile picture to firebase
    uploadVehicleDoc(imageURI, vehicle_id) {
        return new Promise<any>((resolve, reject) => {
            let storageRef = firebase.storage().ref();
            let randomId = vehicle_id;
            let imageRef = storageRef.child('images/vehicle').child(randomId);
            imageRef.putString(imageURI, 'data_url')
                .then(snapshot => {
                    snapshot.ref.getDownloadURL()
                        .then(res => resolve(
                            res
                        ))
                }, err => {
                    reject(err);
                })
        })
    }

    //Upload profile picture to firebase
    uploadDocument(docURI, doc_id) {
        return new Promise<any>((resolve, reject) => {
            let storageRef = firebase.storage().ref();
            let imageRef = storageRef.child('documents/').child(doc_id);
            imageRef.putString(docURI, 'data_url')
                .then(snapshot => {
                    snapshot.ref.getDownloadURL()
                        .then(res => resolve(
                            res
                        ))
                }, err => {
                    reject(err);
                })
        })
    }
}