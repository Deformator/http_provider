import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { BackendProvider } from '../../providers/backend/backend';
import { GlobalProvider } from '../../providers/global/global';
import { Observable } from 'rxjs';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit{

  homeMenu$: Observable<Array<any>>
  // toast;

  constructor(public navCtrl: NavController, private backend: BackendProvider, private global: GlobalProvider, private toastCtrl: ToastController) {
    
  }

  ngOnInit(){
    // this.toast = this.toastCtrl.create({
    //   message: `You are offline`
    // });
    
    this.homeMenu$ = this.backend.getHomeMenu();
  }

}
