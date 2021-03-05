import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class FileuploadService {
  token: any;
  httpOptions: any;

  constructor(@Inject('DOC_URL') private apiUrl: string, private httpClient: HttpClient) {
    this.token = sessionStorage.getItem('token');
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token
      })
    };
  }

  makeFileRequest(documentCode: string, files: Array<File>, comment: string) {
    return new Promise((resolve, reject) => {
      const formData: any = new FormData();
      const xhr = new XMLHttpRequest();
      for (let i = 0; i < files.length; i++) {
        formData.append("files[]", files[i], files[i].name);
      }
      formData.append('document_code', documentCode);
      formData.append("token", this.token);
      formData.append('comment', comment);

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };

      const url = `${this.apiUrl}/uploads`;
      xhr.open("POST", url, true);
      xhr.send(formData);
    });
  }

  uploadHisTransaction(files: File) {
    return new Promise((resolve, reject) => {
      const formData: any = new FormData();
      const xhr = new XMLHttpRequest();

      formData.append("file", files, files.name);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };

      const url = `${this.apiUrl}/his-transaction/upload?token=${this.token}`;
      xhr.open("POST", url, true);
      xhr.send(formData);
    });
  }

  // =============== document service =============== //
  async getFiles(documentCode:any) {
    // const res: any = await this.httpClient.get(`${this.apiUrl}/uploads/info/${documentCode}`).toPromise();
    // return res.json();
    const _url = `${this.apiUrl}/uploads/info/${documentCode}`;
    return this.httpClient.get(_url, this.httpOptions).toPromise();

  }

  async removeFile(documentId:any) {
    const res: any = await this.httpClient.delete(`${this.apiUrl}/uploads/${documentId}`).toPromise();
    return res.json();
  }

}
