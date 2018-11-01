import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";


@Injectable()
export class AuthProvider {
    constructor(private storage: Storage) { }

    auth(login, password) {
        return new Promise((resolve, reject) => {
            if (login === 'admin' && password === '123') {
                this.storage.set('token', 'user-token').then(() => {
                    resolve(true);
                })
            } else {
                reject();
            }
        })

    }
}