import { Component, OnInit,Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentsService } from 'src/app/shared/documents.service';
import { AlertsService } from 'src/app/shared/alerts.service';
import { GroupService } from 'src/app/shared/group.service';
import {FileuploadService} from 'src/app/shared/fileupload.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  documents:any=[];
  group_name:any;
  group_id:any;
  userType:any;

  items:any = [];
  group:any = [];
  group_info:any=[];
  filePath: any;
  fileName: any;
  files: Array<any> = [];
  isUpoading: boolean = false;

  fieldName: any;
  filesToUpload: Array<File> = [];
  documentCode: any;
  comment:any;

  isUploading = false;
  loadingFiles = false;

  openModal = false;

  documents_id:any;
  from_group_id:any;
  from_title:any;
  from_description:any;
  from_docs:any;
  from_is_active:any;

  constructor(    
    private router: Router,
    private alertsService: AlertsService,
    private groupService: GroupService,
    private documentsService: DocumentsService,  
    private fileuploadService:FileuploadService,  
    @Inject('DOC_URL') private docUrl: string,

    ) { }

  ngOnInit(): void {
    this.group_id = sessionStorage.getItem('group_id');
    this.group_name = sessionStorage.getItem('group_name');
    this.userType = sessionStorage.getItem('userType');
    this.groupInfo();
    // console.log(this.group_name);
    if(!this.group_id){
      let group_id =  1;
      this.documentsInfo(group_id);
    }else{
      let group_id = this.group_id;
      // console.log(group_id)s;
      this.documentsInfo(group_id);      
    }

  }

  async documentsInfo(i:any) {
    // console.log(i);
    // this.group_name=i.group_name;
    try {
      const rs: any = await this.documentsService.selectGroupID(i);
      if (rs.rows) {
        this.items = rs.rows
        // console.log(this.items);
    } else {
        const message = rs.message || 'เกิดข้อผิดพลาด';
        this.alertsService.error(message);
      }
    } catch (error) {
      // console.log(error);
      this.alertsService.error('เกิดข้อผิดพลาด');
    }
  }

  // file upload
  fileChangeEvent(fileInput: any) {
    this.filesToUpload = [];
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }

  async upload(_id: any) {

    this.isUploading = true;
    this.documentCode = _id;
    // console.log(this.documentCode);
    // console.log(this.filesToUpload);
    this.comment = null;
    try {
      const result: any = await this.fileuploadService.makeFileRequest(this.documentCode, this.filesToUpload ,this.comment)
      if (result.ok) {
        this.filesToUpload = [];
        this.alertsService.success();
        this.isUploading = false;
        this.ngOnInit();
      } else {
        this.alertsService.error(JSON.stringify(result.error));
      }

    } catch (error) {
      this.isUploading = false;
      this.alertsService.error(JSON.stringify(error));
    }
  }

  async getFilesList(v: any) {
    let _document_id: any;
    let _file_name: any;
    let _no: any;
    this.files = [];
    this.loadingFiles = true;
    let result: any = await this.fileuploadService.getFiles(v.id);
    if (result.rows) {
      _document_id = result.rows.document_id,
        _file_name = result.rows.file_name
    } else {
      _document_id = null;
      _file_name = null;
    }

    let _info = {
      title: v.title,
      description: v.description,
      document_id: _document_id,
      file_name: _file_name
    }
    // console.log(_info);
    this.items.push(_info);
    this.loadingFiles = false;

  }

  getFile(documentId:any) {
    const url = `${this.docUrl}/uploads/files/${documentId}`;
    window.open(url, '_blank');
    // window.location.assign(url);
  }

  async removeFile(documentId:any, idx:any) {
    this.alertsService.confirm('คุณต้องการลบไฟล์นี้ ใช่หรือไม่?')
      .then(() => {
        this.fileuploadService.removeFile(documentId)
        this.ngOnInit();
      })
      .catch(() => {
        // cancel
      });
  }

  async addDocuments(){
    this.openModal = true;
    this.documents_id = null;
    this.from_group_id = this.group_id;
    this.from_title = null;
    this.from_description = null;
    this.from_docs = null;
    this.from_is_active = 'Y';
  
  }

  async save(){
if(!this.documents_id){
  let _info = {
    group_id: this.from_group_id,
    title: this.from_title,
    description: this.from_description,
    docs: this.from_docs,
    is_active: this.from_is_active || "Y"
  }
  console.log(_info);
  try {
    const rs: any = await this.documentsService.save(_info);
    if (rs.rows) {
      this.alertsService.success();
      this.documents_id = null;
      this.from_group_id = null;
      this.from_title = null;
      this.from_description = null;
      this.from_docs = null;
      this.from_is_active = null;
  
      this.ngOnInit();
      this.openModal = false;
    } else {
      const message = rs.message || 'เกิดข้อผิดพลาด';
      this.alertsService.error(message);
    }

  } catch (error) {
    // console.log(error);
    this.alertsService.error('เกิดข้อผิดพลาด');
  }
}else{
  let _info = {
    group_id: this.from_group_id,
    title: this.from_title,
    description: this.from_description,
    docs: this.from_docs,
    is_active: this.from_is_active
  }
  console.log(_info);
  try {
    const rs: any = await this.documentsService.update(this.documents_id,_info);
    if (rs.rows) {
      this.alertsService.success();
      this.documents_id = null;
      this.from_group_id = null;
      this.from_title = null;
      this.from_description = null;
      this.from_docs = null;
      this.from_is_active = null;
  
      this.ngOnInit();
      this.openModal = false;
    } else {
      const message = rs.message || 'เกิดข้อผิดพลาด';
      this.alertsService.error(message);
    }

  } catch (error) {
    // console.log(error);
    this.alertsService.error('เกิดข้อผิดพลาด');
  }
}

  }

  async groupInfo() {
    // console.log(i);
    try {
      const rs: any = await this.groupService.info();
      if (rs.rows) {
        this.group_info = rs.rows
      } else {
        const message = rs.message || 'เกิดข้อผิดพลาด';
        this.alertsService.error(message);
      }
    } catch (error) {
      // console.log(error);
      this.alertsService.error('เกิดข้อผิดพลาด');
    }
  }

  async editDocuments(i:any){
    this.openModal = true;
    this.documents_id = i.documents_id;
    this.from_group_id = i.group_id;
    this.from_title = i.title;
    this.from_description = i.description;
    this.from_docs = i.docs;
    this.from_is_active = i.is_active;
  }

  async cancel(){
    this.openModal = false;
    this.documents_id = null;
    this.from_group_id = null;
    this.from_title = null;
    this.from_description = null;
    this.from_docs = null;
    this.from_is_active = null;
 
  }
}
