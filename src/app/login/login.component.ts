import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoginService } from '../shared/login.service';
import { AlertsService } from '../shared/alerts.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
  username: string |  undefined;
  password: string |  undefined;
  jwtHelper = new JwtHelperService();

  constructor(
    private loginService: LoginService,
    private alertsService: AlertsService,
    private router: Router

  ) { }

  ngOnInit(): void {
  }

  async doLogin() {
    if (this.username && this.password) {
      try {
        const rs: any = await this.loginService.doLogin(this.username, this.password);
        if (rs.token) {
          const token = rs.token;
          sessionStorage.setItem('token', token);
          const decoded: any = this.jwtHelper.decodeToken(token);
          // console.log(decoded);
          
          sessionStorage.setItem('fullname', decoded.fullname);
          sessionStorage.setItem('userType', decoded.userType);
          sessionStorage.setItem('username', this.username);
          let currentUrl = this.router.url;
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
          this.router.navigate([currentUrl]);
          this.router.navigate(['/']);

        } else {
          const message = rs.message || 'เกิดข้อผิดพลาด';
          this.alertsService.error(message);
        }
      } catch (error) {
        // console.log(error);
        this.alertsService.error('เกิดข้อผิดพลาด');
      }
    } else {
      this.alertsService.error('เกิดข้อผิดพลาด');
    }

  }
}
