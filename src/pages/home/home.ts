import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BackendProvider } from '../../providers/backend';
import { Observable } from 'rxjs';
import { UtilsProvider } from '../../providers/utils';
import { catchError, tap } from 'rxjs/operators';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {

  homeMenu$: Observable<Array<any>>
  showSpinner = false

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
    // this.utils.spinner(true);
    this.setHomeMenu();
    this.setHomeMenu();
    this.setHomeMenu();
    //  this.utils.spinner(false);
  }

  setHomeMenu() {
    this.showSpinner = true
    this.homeMenu$ = this.backend.getHomeMenu()
      .pipe(
        tap(() => { this.showSpinner = false }),
        catchError(err => {
          this.showSpinner = false

          this.utils.presentToastError(err)
          return [];
        })
      )
  }

  doRefresh(refresher) {
    this.setHomeMenu();
    refresher.complete();
  }

}
