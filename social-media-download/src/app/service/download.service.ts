import { HttpClient, HttpEvent, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';
import { Observable } from 'rxjs'
import {tap, map} from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  apiBaseURL = environment.apiBaseURL;
  constructor(private http: HttpClient) { }

  downloadVideo(url: string): Observable<HttpEvent<Blob>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(this.apiBaseURL + 'insta-download', {'url': url}, {headers, observe: 'events', responseType: 'blob', reportProgress: true}).pipe((
      tap((event:any) => this.getEventMessage(event)),
      map(event => this.transformEvent(event))
    ))
  }

  private getEventMessage(event: HttpEvent<any>) {
    switch (event.type) {
      case HttpEventType.Sent:
        console.log('Request sent!')
        break;
      case HttpEventType.DownloadProgress:
        const percentage = Math.round(100 * event.loaded / (event.total || 1));
        console.log(`File is ${percentage} downloaded`)
        break;
      case HttpEventType.Response:
        console.log('File downlaoded is successfull')
        break;
      default:
        console.log(`Unhandled event ${event.type}`)
    }
  }

  private transformEvent(event: HttpEvent<any>) {
    switch (event.type) {
      case HttpEventType.DownloadProgress:
        console.log(event.total)
        return {progress: (event.loaded/1000000).toFixed(2)}
      case HttpEventType.Response:
        return event.body
      default:
        return event
    }
  }

  saveVideo(blob: Blob, fileName: string) {
    saveAs(blob, fileName)
  }

  convertYoutubeTomp3(url:string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(this.apiBaseURL + 'ytmp3-download', {'url': url}, {headers: headers, responseType: 'blob', observe: 'response'}).pipe(
      map(response =>  {
        if (response.body) {
          return response.body
        } else {
          throw new Error('No mp3 file recieved')
        }
      })
    )
  }
}
