import { AccountOperationService } from './../../../services/account-operation.service';
import { Account } from './../../../models/account';
import { Component, OnInit } from '@angular/core';
import { AccountTransferService } from 'src/app/services/account-transfer.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css']
})
export class DepositComponent implements OnInit {

  depositForm: FormGroup;
  showForm: boolean;
  showReciept: boolean;
  curr_account: Account;
  recieptData: number;
  constructor(private formBuilder: FormBuilder, private accountTransferService: AccountTransferService, private accountOpsService: AccountOperationService, private router: Router, private route: ActivatedRoute, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.depositForm = this.formBuilder.group({
      ACC_ID: [{value: '', disabled: true}],
      CUST_ID: [{value: '', disabled: true}],
      AccType: [{value: '', disabled: true}],
      Balance: [{value: '', disabled: true}],
      NewAmount: ['', Validators.required]
    });
    this.fillData();
  }

  fillData() {
    this.accountTransferService.currentAccountData.subscribe((data) => {
      if (data.length >0 ) {
        let acc_data = data[0];
        this.curr_account = acc_data;
        this.depositForm.patchValue({
          'CUST_ID': acc_data.CUST_ID,
          'ACC_ID': acc_data.ACC_ID,
          'AccType': acc_data.AccType,
          'Balance': acc_data.Amount,
        });
        this.showForm = true;
        this.showReciept = false;
      }
      else {
        this.showForm = false;
      }
    });
  }

  onSubmit() {
    if (this.depositForm.valid) {
      let updated_account:Account = {};
      updated_account.ACC_ID = this.depositForm.get('ACC_ID').value;
      updated_account.Amount = this.depositForm.get('NewAmount').value;
      updated_account.Operation = 'DEPOSIT';
      this.accountOpsService.depositByACCId(updated_account).subscribe((res) => {
        this.recieptData = res;
        this.showReciept = true;
        this.toastr.success('Amount Deposited Successfully', 'Success');
      },
      (error) => {
        this.toastr.error('Some Error Occurred', 'Error');
      }
      );
    }
    else {
      return false;
    }
  }

  redirect() {
    this.router.navigate(['../details'], {relativeTo: this.route});
  }

}
