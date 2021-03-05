import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/shared/category.service'
import { GroupService } from 'src/app/shared/group.service'
import { AlertsService } from 'src/app/shared/alerts.service'

@Component({
  selector: 'app-layout-main',
  templateUrl: './layout-main.component.html',
  styleUrls: ['./layout-main.component.scss']
})
export class LayoutMainComponent implements OnInit {
  fullname: any;
  userType: any;
  category:any = [];
  group:any = [];
  category_name:any;
  category_id:any;

  constructor(
    private categoryService: CategoryService,
    private groupService: GroupService,
    private alertsService: AlertsService,
    private router: Router
    ) {}

  ngOnInit(): void {
    this.fullname = sessionStorage.getItem('fullname');
    this.userType = sessionStorage.getItem('userType');
    this.category_name = sessionStorage.getItem('category_name');
    this.category_id = sessionStorage.getItem('category_id');
    if(this.category_id){
      let i = {
        category_name:this.category_name,
        category_id:this.category_id
      }
      this.groupInfo(i);
    }
      this.categoryInfo();
  }

  logOut() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('fullname');
    sessionStorage.removeItem('userType');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('hcode');
    this.router.navigate(['/']);
    this.ngOnInit();
  }

  async categoryInfo() {
    try {
      const rs: any = await this.categoryService.info();
      // console.log(rs);
      
      if (rs.rows) {
        this.category = rs.rows
        // console.log(this.category);
        if(!this.category_id){
          this.category_name = this.category[0].category_name;
          this.groupInfo(this.category[0])
        }

      } else {
        const message = rs.message || 'เกิดข้อผิดพลาด';
        this.alertsService.error(message);
      }
    } catch (error) {
      // console.log(error);
      this.alertsService.error('เกิดข้อผิดพลาด');
    }
  }
  async groupInfo(i:any) {
    // console.log(i);
    this.category_name=i.category_name;
    sessionStorage.setItem('category_name', i.category_name);
    sessionStorage.setItem('category_id', i.category_id);

    try {
      const rs: any = await this.groupService.selectCategoryId(i.category_id);
      // console.log(rs);
      if (rs.rows) {
        this.group = rs.rows
      } else {
        const message = rs.message || 'เกิดข้อผิดพลาด';
        this.alertsService.error(message);
      }
    } catch (error) {
      // console.log(error);
      this.alertsService.error('เกิดข้อผิดพลาด');
    }
  }

  async documentsInfo(i:any) {
    // console.log(i);
    // sessionStorage.setItem('group_name', i.group_name);
    sessionStorage.setItem('group_id', i.group_id);
    sessionStorage.setItem('group_name', i.group_name);
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
    this.router.navigate(['/']);
  }
}
