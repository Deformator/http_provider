import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CacheService } from "ionic-cache";
import { Observable, Subject } from 'rxjs';
import { last, map } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { GlobalProvider } from '../global/global';



@Injectable()
export class BackendProvider {

  protocol = 'https://'; //protocol name
  domainName = 'opseuapp.org'; //domain name
  apiUrl = '/wp-json/umevents/v1/'; //api url
  ttl = 60 * 60 * 24 * 30; // time after cache will expire (in milliseconds)
  token = ''; //token

  constructor(
    public http: HttpClient,
    private cache: CacheService,
    private storage: Storage,
    private global: GlobalProvider
  ) {

  }

  // base shape for HTTP request 
  request(endpoint: string, requestType: string, fresh: boolean, data?: any) {

    //init headers for HTTP request
    let httpOptions = {
      headers: new HttpHeaders({
        'Token': this.token
      })
    }

    //observable subject which is observable and observer in the same time
    const subject = new Subject();

    //url for HTTP request
    const requestedUrl = `${this.protocol}${this.domainName}${this.apiUrl}${endpoint}`;

    //request varible which will be store Observable
    let request$;

    //check type of HTTP request and set the proper method to request variable
    if (requestType === 'GET') {
      request$ = this.http.get(requestedUrl, httpOptions);
    } else if (requestType === 'POST') {
      //get data object and parse it to Form Data object for sending 'Multipart form' data type
      let body: FormData = new FormData();
      Object.keys(data).forEach(key => {
        body.append(key, data[key]);
      });
      request$ = this.http.post(requestedUrl, body, httpOptions);
    }

    //get cached data from storage
    this.storage.get(requestedUrl)
      .then(cachedResponse => {
        //chek if we have cached data and user don't want fresh data from a server 
        if (cachedResponse && !fresh) {
          //return cached data
          subject.next(
            {
              dataType: 'cache',
              data: JSON.parse(cachedResponse.value)
            }
          );
          subject.complete();
        }
        //if we don't have cached data or user wants fresh one
        else {
          //chek if we have an internet connection
          if (this.global.networkAvailable) {
            //do request in storage then to a server
            this.cache.loadFromDelayedObservable(requestedUrl, request$, requestType, this.ttl, 'all')
              //returns only server response
              .pipe(
                last()
              )
              .subscribe((res: any) => {
                //check response status
                if (res.status === `SUCCESS`) {
                  //return live data from a server
                  subject.next(
                    {
                      dataType: 'live',
                      data: res
                    }
                  );
                  subject.complete();
                }
                //if server response is 200 but status wasn't SUCCESS 
                else {
                  //remove cached object from storage
                  this.cache.removeItem(requestedUrl);
                  console.log(`Server requested with a not success status: ${res.status}`);
                  //emit an error
                  subject.error(`Server requested with a not success status: ${res.status}`);
                }

              },
                //if request returns not status 200
                (error: Response) => {
                  console.log(`Request to the server ${requestedUrl} returns an error: ${error.status}`);
                  //emit an error
                  subject.error(`Request to the server ${requestedUrl} returns an error: ${error.status}`)
                })
          }
          //network is unavailable
          else {
            //emit an error
            subject.error('Network is unavailable');
          }

        }
      })
      //we got an error when tried to reqch a storage
      .catch(err => {
        //emit an error
        subject.error(`Can't reach the storage. Error: ${err}`);
      })

    return subject;
  }

  //GET request
  getRequest(endpoint: string, fresh = false) {
    return this.request(endpoint, 'GET', fresh);
  }

  //POST request
  postRequest(endpoint: string, fresh = false, data) {
    return this.request(endpoint, 'POST', fresh, data);
  }


  getHomeMenu(fresh = false): Observable<Array<any>> {
    return this.getRequest(`home-menu`, fresh)
      .pipe(
        map((res: any) => res = res.data.menu)
      )
  }

}
