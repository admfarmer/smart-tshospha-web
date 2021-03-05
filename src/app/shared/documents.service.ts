import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {

  token: any;
  httpOptions: any;

  constructor(@Inject('API_URL') private apiUrl: string, private httpClient: HttpClient) {
    this.token = sessionStorage.getItem('token');
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token
      })
    };
  }
  
  async info() {
    const _url = `${this.apiUrl}/documents/info`;
    return this.httpClient.get(_url, this.httpOptions).toPromise();
  }

  async selectGroupID(groupID:any) {
    const _url = `${this.apiUrl}/documents/selectGroupID?groupID=${groupID}`;
    return this.httpClient.get(_url, this.httpOptions).toPromise();
  }

  async save(data: object) {
    const _url = `${this.apiUrl}/documents/insert`;
    return this.httpClient.post(_url, data, this.httpOptions).toPromise();
  }

  async update(documentsID: any, data: object) {
    const _url = `${this.apiUrl}/documents/update?documentsID=${documentsID}`;
    return this.httpClient.put(_url, data, this.httpOptions).toPromise();
  }
}
