import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertsService } from 'src/app/shared/alerts.service'
import { AuthGuardService } from 'src/app/shared/auth-guard.service'
import { FileuploadService } from 'src/app/shared/fileupload.service'
import { LoginService } from 'src/app/shared/login.service'
import { UserService } from 'src/app/shared/user.service'
import { CategoryService } from 'src/app/shared/category.service'
import { DocumentsService } from 'src/app/shared/documents.service'
import { GroupService } from 'src/app/shared/group.service'

@NgModule({
  declarations: [
    
  ],
  imports: [
    CommonModule
  ],
  exports: [

  ],
  providers: [
    AlertsService,
    AuthGuardService,
    FileuploadService,
    LoginService,
    UserService,
    CategoryService,
    DocumentsService,
    GroupService
  ]
})
export class SharedModule { }
