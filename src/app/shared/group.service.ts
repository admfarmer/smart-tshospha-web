import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

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
    const _url = `${this.apiUrl}/group/info`;
    return this.httpClient.get(_url, this.httpOptions).toPromise();
  }

  async selectCategoryId(categoryID:any) {
    const _url = `${this.apiUrl}/group/selectCategoryId?categoryID=${categoryID}`;
    return this.httpClient.get(_url, this.httpOptions).toPromise();
  }  
  async selectGroupID(categoryID:any) {
    const _url = `${this.apiUrl}/group/selectGroupID?categoryID=${categoryID}`;
    return this.httpClient.get(_url, this.httpOptions).toPromise();
  }
}
