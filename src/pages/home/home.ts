import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { BackendProvider } from '../../providers/backend/backend';
import { GlobalProvider } from '../../providers/global/global';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit{

  homeMenu$: Observable<Array<any>>

  constructor(public navCtrl: NavController, private backend: BackendProvider, private global: GlobalProvider, private toastCtrl: ToastController) {
    
  }

  ngOnInit(){
    this.homeMenu$ = this.backend.getHomeMenu()
    .catch(err => {
      alert(JSON.stringify(err.message))
      return [];
    })
  }

}
