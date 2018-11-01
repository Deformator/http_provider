import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CacheService } from "ionic-cache";
import { Observable, Subject } from 'rxjs';
import { last, map } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { GlobalProvider } from '../global/global';



@Injectable()
export class BackendProvider {

  protocol = 'https://';
  domainName = 'opseuapp.org';
  apiUrl = '/wp-json/umevents/v1/';
  testUrl = 'https://opseuapp.org/wp-json/umevents/v1/';
  ttl = 60 * 60

  constructor(public http: HttpClient, private cache: CacheService, private storage: Storage, private global: GlobalProvider) {

  }

  postRequest(endpoint: string, fresh = false) {
    const subject = new Subject();

    const requestedUrl = `${this.protocol}${this.domainName}${this.apiUrl}${endpoint}`;
    const request$ = this.http.get(requestedUrl);

    this.storage.get(requestedUrl)
      .then(cachedResponse => {
        if (cachedResponse && !fresh) {
          subject.next(
            {
              dataType: 'cache',
              data: JSON.parse(cachedResponse.value)
            }
          );
          subject.complete();
        } else {
          if (this.global.networkAvailable) {
            this.cache.loadFromDelayedObservable(requestedUrl, request$, 'GET', this.ttl, 'all')
              .pipe(
                last()
              )
              .subscribe((res: any) => {
                if (res.status === `SUCCESS`) {
                  subject.next(
                    {
                      dataType: 'live',
                      data: res
                    }
                  );
                  // subject.complete();
                } else {
                  this.cache.removeItem(requestedUrl);
                  console.log(`Server requested with a not success status: ${res.status}`); //adjust a handler
                  subject.complete();
                }

              },
                (error: Response) => {
                  console.log(`Request to the server returns an error: ${error.status}`);
                })
          } else {
            console.log(`Network is unavailable`);
          }

        }
      })
      .catch(err => console.log(`Server requested with a not success status: ${err}`))

    return subject;

  }



  getRequest(endpoint: string, fresh = false) {
    const subject = new Subject();

    const requestedUrl = `${this.protocol}${this.domainName}${this.apiUrl}${endpoint}`;
    // const requestBody = 
    const request$ = this.http.get(requestedUrl);

    this.storage.get(requestedUrl)
      .then(cachedResponse => {
        if (cachedResponse && !fresh) {
          subject.next(
            {
              dataType: 'cache',
              data: JSON.parse(cachedResponse.value)
            }
          );
          subject.complete();
        } else {
          if (this.global.networkAvailable) {
            this.cache.loadFromDelayedObservable(requestedUrl, request$, 'GET', this.ttl, 'all')
              .pipe(
                last()
              )
              .subscribe((res: any) => {
                if (res.status === `SUCCESS`) {
                  subject.next(
                    {
                      dataType: 'live',
                      data: res
                    }
                  );
                  // subject.complete();
                } else {
                  this.cache.removeItem(requestedUrl);

                  console.log(`Server requested with a not success status: ${res.status}`); //adjust a handler
                  subject.error('error');
                }

              },
                (error: Response) => {
                  console.log(`Request to the server returns an error: ${error.status}`);
                  //  throw error;
                  subject.error(error)
                })
          } else {
            subject.error('Network is unavailable');
          }

        }
      })
      .catch(err => {
        subject.error(err);
      })

    return subject;
  }



  getHomeMenu(fresh = false): Observable<Array<any>> {
    return this.getRequest(`home-menu1`, fresh)
      .pipe(
        map((res: any) => res = res.data.menu),
        // catchError(err => {
        //   console.log('home-menu error')
        //   throw err
        // })
      )
  }

}
