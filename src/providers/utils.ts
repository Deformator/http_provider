import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';


@Injectable()
export class UtilsProvider {
    constructor(private toastCtrl: ToastController) {
    }

    presentToastError(error: string){
        const toast = this.toastCtrl.create({
          message: error,
          duration: 3000
        });
        toast.present();
      }
}