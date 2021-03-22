// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import tinymce from "tinymce";

export const environment = {
  production: false,
  firebaseConfig: {
    //https://firebase.google.com/docs/web/setup
    apiKey: "AIzaSyBOQAUC-7FuXIzCwxlsAzGIMNaPVtWD2ms",
    authDomain: "lebo-m-courier.firebaseapp.com",
    projectId: "lebo-m-courier",
    storageBucket: "lebo-m-courier.appspot.com",
    messagingSenderId: "907749237178",
    appId: "1:907749237178:web:efe58e6693100562653d83",
    measurementId: "G-X1PETXZSFE"
  },
  tinymce: {
    //https://www.tiny.cloud/blog/how-to-get-tinymce-cloud-up-in-less-than-5-minutes/
    apiKey: "3pk5w7ysktp2k6kbdo0girxw2h42l4eeeyc3wew857xn9s50"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
