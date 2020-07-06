import { AccountTransferService } from './../../../services/account-transfer.service';
import { Account } from './../../../models/account';
import { AccountOperationService } from './../../../services/account-operation.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.css']
})
export class AccountDetailsComponent implements OnInit {

  accountDetailForm: FormGroup;
  showForm: boolean;
  accounts: Account[] = [];
  account: Account;
  constructor(private formBuilder: FormBuilder, private accountOpsService: AccountOperationService, private accountTransferService: AccountTransferService, private router: Router, private route: ActivatedRoute, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.accountDetailForm = this.formBuilder.group({
      SSN_ID: ['', [ Validators.required, Validators.minLength(9), Validators.maxLength(9) ] ],
      CUST_ID: ['', [ Validators.required, Validators.minLength(9), Validators.maxLength(9) ] ],
      ACC_ID: ['', [ Validators.required, Validators.minLength(9), Validators.maxLength(9) ] ]
    });
    this.displayForm();
    this.onChangeIdentity();
  }

  displayForm() {
    this.accounts = JSON.parse(localStorage.getItem('ACCOUNTS'));
    if (!(this.accounts && this.accounts.length>0)) {
      //LIST IS EMPTY SO DISPLAY FORM
      this.showForm = true;
    }
    else {
      //DISPLAY ACCOUNT(S) DATA
      this.refreshlist();
      this.showForm = false;
    }
  }

  onChangeIdentity() {
    this.accountDetailForm.get('CUST_ID').valueChanges
    .subscribe(() => {
      if (this.accountDetailForm.get('CUST_ID').valid) {
        this.accountDetailForm.get('SSN_ID').disable();
        this.accountDetailForm.get('ACC_ID').disable();
      }
    });
    this.accountDetailForm.get('SSN_ID').valueChanges
    .subscribe(() => {
      if (this.accountDetailForm.get('SSN_ID').valid) {
        this.accountDetailForm.get('CUST_ID').disable();
        this.accountDetailForm.get('ACC_ID').disable();
      }
    });
    this.accountDetailForm.get('ACC_ID').valueChanges
    .subscribe(() => {
      if (this.accountDetailForm.get('ACC_ID').valid) {
        this.accountDetailForm.get('CUST_ID').disable();
        this.accountDetailForm.get('SSN_ID').disable();
      }
    });
  }

  onSubmit() {
    if (this.accountDetailForm.get('CUST_ID').value != '') {
      var id = this.accountDetailForm.get('CUST_ID').value;
      this.accountOpsService.getAccountsByCUSTId(id).subscribe((res) => {
        if (res.body.length > 0) {
        this.accounts = res.body;
        localStorage.setItem('ACCOUNTS', JSON.stringify(this.accounts));
        this.showForm = false;
        }
        else {
          this.toastr.warning('No Active Accounts Present!', 'Warning');
        }
      },
      (error) => {
        this.toastr.error('Invalid ID!', 'Error');
        throw error;
      }
      );
    }
    else if (this.accountDetailForm.get('SSN_ID').value != '')
    {
      var id = this.accountDetailForm.get('SSN_ID').value;
      this.accountOpsService.getAccountsBySSNId(id).subscribe((res) => {
        if (res.body.length > 0) {
        this.accounts = res.body;
        localStorage.setItem('ACCOUNTS', JSON.stringify(this.accounts));
        this.showForm = false;
        }
        else {
          this.toastr.warning('No Active Accounts Present!', 'Warning');
        }
      },
      (error) => {
        this.toastr.error('Invalid ID!', 'Error');
        throw error;
      }
      );
    }
    else if (this.accountDetailForm.get('ACC_ID').value != '') {
      var id = this.accountDetailForm.get('ACC_ID').value;
      this.accountOpsService.getAccountByACCId(id).subscribe((res) => {
        this.account = res.body;
        this.accounts = [];
        this.accounts.push(this.account);
        localStorage.setItem('ACCOUNTS', JSON.stringify(this.accounts));
        this.showForm = false;
      },
      (error) => {
        this.toastr.error('InActive Account!', 'Error');
        throw error;
      }
      );
    }
    else {
      return false;
    }
  }

  resetForm(form: FormGroup) {
    localStorage.setItem('ACCOUNTS', JSON.stringify([]));
    this.showForm = true;
    form.reset();
    this.accountDetailForm.get('CUST_ID').enable();
    this.accountDetailForm.get('SSN_ID').enable();
    this.accountDetailForm.get('ACC_ID').enable();
    this.accountDetailForm.patchValue({
      'CUST_ID': '',
      'SSN_ID': '',
      'ACC_ID': ''
    });
  }

  deposit(acc_record: number) {
    this.account = this.accounts[acc_record];
    let new_acc_list: Account[] = [];
    new_acc_list.push(this.account)
    this.accountTransferService.changeAccountData(new_acc_list);
    this.router.navigate(['../deposit'], {relativeTo: this.route});
  }

  withdraw(acc_record: number) {
    this.account = this.accounts[acc_record];
    let new_acc_list: Account[] = [];
    new_acc_list.push(this.account)
    this.accountTransferService.changeAccountData(new_acc_list);
    this.router.navigate(['../withdraw'], {relativeTo: this.route});
  }

  transfer(acc_record: number) {
    this.account = this.accounts[acc_record];
    let new_acc_list: Account[] = [];
    new_acc_list.push(this.account)
    this.accountTransferService.changeAccountData(new_acc_list);
    this.router.navigate(['../transfer'], {relativeTo: this.route});
  }

  refresh(acc_record: number) {
    this.account = this.accounts[acc_record];
    //GET NEW DETAILS
    var id = this.account.ACC_ID;
    this.accountOpsService.getAccountByACCId(id).subscribe((res) => {
      this.account = res.body;
      this.accounts[acc_record] = this.account;
      localStorage.setItem('ACCOUNTS', JSON.stringify(this.accounts));
      this.showForm = false;
      this.toastr.info('Record Refreshed!', 'Info');
    },
    (error) => {
      this.toastr.error('InActive Account!', 'Error');
      throw error;
    }
    );
  }

  refreshlist() {
    var id = this.accounts[0].CUST_ID;
      this.accountOpsService.getAccountsByCUSTId(id).subscribe((res) => {
        if (res.body.length > 0) {
        this.accounts = res.body;
        localStorage.setItem('ACCOUNTS', JSON.stringify(this.accounts));
        this.showForm = false;
        this.toastr.info('List Refreshed!', 'Info');
        }
        else {
          this.toastr.warning('No Active Accounts Present!', 'Warning');
        }
      },
      (error) => {
        this.toastr.error('Invalid ID!', 'Error');
        throw error;
      }
      );
  }

}
