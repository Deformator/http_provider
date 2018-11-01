import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class GlobalProvider {

  networkAvailable = navigator.onLine;

  constructor() {
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
