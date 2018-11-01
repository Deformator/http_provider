import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { Network } from '@ionic-native/network';

@Injectable()
export class GlobalProvider {

  networkAvailable = navigator.onLine;

  constructor(
    // private network: Network
    ) {

  }

  setupEvents(){

    window.addEventListener("online", (e) => {
      this.networkAvailable = navigator.onLine;
      // console.log(this.networkAvailable);
    }, false);   
   
    window.addEventListener("offline", (e) => {
      this.networkAvailable = navigator.onLine;
      // console.log(this.networkAvailable);
    }, false); 

  }

}
