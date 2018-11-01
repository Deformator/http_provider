import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BackendProvider } from '../../providers/backend';
import { Observable } from 'rxjs';
import { UtilsProvider } from '../../providers/utils';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {

  homeMenu$: Observable<Array<any>>

  constructor(
    public navCtrl: NavController,
    private backend: BackendProvider,
    private utils: UtilsProvider
  ) {

  }

  ionViewCanEnter() {
    return this.backend.setTokenToHeaders().then((tokenWasSet) => {
      if (!tokenWasSet) {
        this.utils.presentToastError(`Token wasn't set, check the storage`, `top`);
      }
      return true;
    })
  }

  ngOnInit() {
    this.homeMenu$ = this.backend.getHomeMenu()
      .catch(err => {
        this.utils.presentToastError(err)
        return [];
      })
  }

}
