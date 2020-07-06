import { AccountService } from './../../../../services/account.service';
import { Account } from './../../../../models/account';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-status-account',
  templateUrl: './status-account.component.html',
  styleUrls: ['./status-account.component.css']
})
export class StatusAccountComponent implements OnInit {

  accounts: Account[] = [];
  constructor(private accountService: AccountService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.refreshAll();
  }

  refresh(record_val) {
    var id = this.accounts[record_val].ACC_ID;
    this.accountService.getAccountByACCId(id).subscribe((res) => {
      this.accounts[record_val] = res.body;
      this.toastr.info('Account Record Refreshed!', 'Info');
    });
  }

  refreshAll() {
    this.accountService.getAllAccounts().subscribe((res) => {
      this.accounts = res;
      this.toastr.info('Account List Refreshed!', 'Info');
    });
  }

}
