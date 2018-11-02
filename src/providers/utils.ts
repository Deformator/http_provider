import { Injectable } from '@angular/core';
import { ToastController, LoadingController } from 'ionic-angular';


@Injectable()
export class UtilsProvider {



    constructor(private toastCtrl: ToastController, private loadingCtrl: LoadingController) {
    }

    loading: any;
    toast: any;

    presentToastError(error: string, position: string = 'bottom') {
        this.toast = this.toastCtrl.create({
            message: error,
            duration: 3000,
            position: position
        });
        this.toast.present();
    }

    spinner(status) {
        console.log(status)
       
        if (status) {
            this.loading = this.loadingCtrl.create({
            })
            this.loading.present();
        } else {
            this.loading.dismiss();
        }

    }
}