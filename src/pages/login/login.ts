import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth';
import { HomePage } from '../home/home';
import { UtilsProvider } from '../../providers/utils';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(public navCtrl: NavController, private auth: AuthProvider, private utils: UtilsProvider) {
  }

  async login() {
    try {
      await this.auth.auth('admin', '123');
      this.navCtrl.push(HomePage);
    } catch (err) {
      this.utils.presentToastError('Wrong Credentials');
    }
  }

}
