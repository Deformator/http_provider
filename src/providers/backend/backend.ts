import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  ttl = 60 * 60 * 24 * 30;
  token = '';

  constructor(public http: HttpClient, private cache: CacheService, private storage: Storage, private global: GlobalProvider) {

  }

  request(endpoint: string, requestType: string, fresh = false, data?: any){

    let httpOptions = {
      headers: new HttpHeaders({
        'Token': this.token
      })
    }

    const subject = new Subject();
    const requestedUrl = `${this.protocol}${this.domainName}${this.apiUrl}${endpoint}`;
    let request$;
    if(requestType === 'GET'){
      request$ = this.http.get(requestedUrl,httpOptions);
    }else if(requestType === 'POST'){
      request$ = this.http.post(requestedUrl, body, httpOptions);
    }
    
    

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
          this.cache.loadFromDelayedObservable(requestedUrl, request$, 'POST', this.ttl, 'all')
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
                subject.error(`Server requested with a not success status: ${res.status}`);
              }

            },
              (error: Response) => {
                console.log(`Request to the server ${requestedUrl} returns an error: ${error.status}`);
                //  throw error;
                subject.error(`Request to the server ${requestedUrl} returns an error: ${error.status}`)
              })
        } else {
          subject.error('Network is unavailable');
        }

      }
    })
    .catch(err => {
      subject.error(`Can't reach the storage. Error: ${err}`);
    })

  return subject;
  }

  postRequest(endpoint: string, fresh = false, data?: any) {

    // let httpOptions = {
    //   headers: new HttpHeaders({
    //     'Token': this.token
    //   })
    // }

    // let body: FormData = new FormData();

    // const subject = new Subject();
    // const requestedUrl = `${this.protocol}${this.domainName}${this.apiUrl}${endpoint}`;
    // const request$ = this.http.post(requestedUrl, body, httpOptions);

    // Object.keys(data).forEach(key => {
    //   body.append(key, data[key]);
    // });


    

    // this.request(endpoint, 'POST', fresh = false, data)

    // this.storage.get(requestedUrl)
    //   .then(cachedResponse => {
    //     if (cachedResponse && !fresh) {
    //       subject.next(
    //         {
    //           dataType: 'cache',
    //           data: JSON.parse(cachedResponse.value)
    //         }
    //       );
    //       subject.complete();
    //     } else {
    //       if (this.global.networkAvailable) {
    //         this.cache.loadFromDelayedObservable(requestedUrl, request$, 'POST', this.ttl, 'all')
    //           .pipe(
    //             last()
    //           )
    //           .subscribe((res: any) => {
    //             if (res.status === `SUCCESS`) {
    //               subject.next(
    //                 {
    //                   dataType: 'live',
    //                   data: res
    //                 }
    //               );
    //               // subject.complete();
    //             } else {
    //               this.cache.removeItem(requestedUrl);

    //               console.log(`Server requested with a not success status: ${res.status}`); //adjust a handler
    //               subject.error(`Server requested with a not success status: ${res.status}`);
    //             }

    //           },
    //             (error: Response) => {
    //               console.log(`Request to the server ${requestedUrl} returns an error: ${error.status}`);
    //               //  throw error;
    //               subject.error(`Request to the server ${requestedUrl} returns an error: ${error.status}`)
    //             })
    //       } else {
    //         subject.error('Network is unavailable');
    //       }

    //     }
    //   })
    //   .catch(err => {
    //     subject.error(`Can't reach the storage. Error: ${err}`);
    //   })

    // return subject;

  }



  getRequest(endpoint: string, fresh = false) {

    let httpOptions = {
      headers: new HttpHeaders({
        'Token': this.token
      })
    }
    const subject = new Subject();

    const requestedUrl = `${this.protocol}${this.domainName}${this.apiUrl}${endpoint}`;

    const request$ = this.http.get(requestedUrl, httpOptions);

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
                console.log(res)
                if (res.status === `SUCCESS`) {
                  subject.next(
                    {
                      dataType: 'live',
                      data: res
                    }
                  );
                  subject.complete();
                } else {
                  this.cache.removeItem(requestedUrl);
                  console.log(`Server requested with a not success status: ${res.status}`); //adjust a handler
                  subject.error(`Server requested with a not success status: ${res.status}`);
                }

              },
                (error: Response) => {
                  console.log(`Request to the server ${requestedUrl} returns an error: ${error.status}`);
                  subject.error(`Request to the server ${requestedUrl} returns an error: ${error.status}`)
                })
          } else {
            subject.error('Network is unavailable');
          }

        }
      })
      .catch(err => {
        subject.error(`Can't reach the storage. Error: ${err}`);
      })

    return subject;
  }



  getHomeMenu(fresh = false): Observable<Array<any>> {
    return this.getRequest(`home-menu1`, fresh)
      .pipe(
        map((res: any) => res = res.data.menu)
      )
  }

}
