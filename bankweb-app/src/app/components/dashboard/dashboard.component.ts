import { User } from './../../models/user';
import { LoginService } from './../../services/login.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  user: User;
  user_bool: boolean;
  constructor(private router: Router, private loginService: LoginService, private route: ActivatedRoute) {
    this.user = this.loginService.isAlreadyLogin();
  }

  ngOnInit(): void {
    if (localStorage.getItem('FIRST_TIME_LOAD') == null) {
      localStorage.setItem('FIRST_TIME_LOAD', 'TRUE');
      var ftl_bool = 'TRUE';
    }
    else {
      var ftl_bool = localStorage.getItem('FIRST_TIME_LOAD');
    }
    this.redirectReload(ftl_bool);
  }

  redirectReload(ftl_bool: string) {
    localStorage.setItem('FIRST_TIME_LOAD', 'FALSE');
    if (this.user.profile.prId == 'bankExe') {
      this.user_bool = true;
      if (ftl_bool == 'TRUE') {
        this.router.navigate([`customer/create`], {relativeTo: this.route});
      }
    }
    else {
      this.user_bool = false;
      if (ftl_bool == 'TRUE') {
        this.router.navigate([`account/details`], {relativeTo: this.route});
      }
    }
  }

  logout() {
    //CALL SERVICE TO CLEAR LOCAL STORAGE
    localStorage.removeItem('FIRST_TIME_LOAD');
    this.loginService.logout();
    this.router.navigate([`/login`], { replaceUrl: true });
  }

}
