import { Component, OnInit } from '@angular/core';
import { Account } from './../../../models/account';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountTransferService } from 'src/app/services/account-transfer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountOperationService } from 'src/app/services/account-operation.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.css']
})
export class WithdrawComponent implements OnInit {

  withdrawForm: FormGroup;
  showForm: boolean;
  showReciept: boolean;
  curr_account: Account;
  recieptData: number;
  constructor(private formBuilder: FormBuilder, private accountTransferService: AccountTransferService, private accountOpsService: AccountOperationService, private router: Router, private route: ActivatedRoute, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.withdrawForm = this.formBuilder.group({
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
        this.withdrawForm.patchValue({
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
    if (this.withdrawForm.valid) {
      let updated_account:Account = {};
      updated_account.ACC_ID = this.withdrawForm.get('ACC_ID').value;
      updated_account.Amount = this.withdrawForm.get('NewAmount').value;
      updated_account.Operation = 'WITHDRAW';
      this.accountOpsService.withdrawByACCId(updated_account).subscribe((res) => {
        this.recieptData = res.LATEST;
        this.showReciept = true;
        this.toastr.success('Amount Withdrawn Successfully', 'Success');
      },
      (error) => {
        this.toastr.error('Insufficient Balance', 'Error');
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
