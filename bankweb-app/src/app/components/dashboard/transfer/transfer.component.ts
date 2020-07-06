import { Account } from './../../../models/account';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountTransferService } from 'src/app/services/account-transfer.service';
import { AccountOperationService } from 'src/app/services/account-operation.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css']
})
export class TransferComponent implements OnInit {

  transferForm: FormGroup;
  showReciept: boolean = false;
  active_acc_list: Account[];
  id_list: number[] = [];
  src_id_list: number[] = [];
  trg_id_list: number[] = [];
  src_account: Account = {};
  trg_account: Account = {};
  latest_src_amount: number;
  latest_trg_amount: number;
  constructor(private formBuilder: FormBuilder, private accountService: AccountService, private accountTransferService: AccountTransferService, private accountOpsService: AccountOperationService, private router: Router, private route: ActivatedRoute, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.transferForm = this.formBuilder.group({
      SRC_ACC_ID: ['', Validators.required],
      TRG_ACC_ID: ['', Validators.required],
      TransferAmount: ['', Validators.required]
    });
    this.fillData_1();
    this.fillData_2();
  }

  fillData_1() {
    this.accountTransferService.currentAccountData.subscribe((data) => {
      if (data.length >0 ) {
        let acc_data = data[0];
        this.transferForm.patchValue({
          'TRG_ACC_ID': acc_data.ACC_ID,
        });
      }
      else {
        //this.showForm = false;
      }
    });
  }

  fillData_2() {
    this.accountService.getActiveAccounts().subscribe((res) => {
      this.active_acc_list = res;
      this.active_acc_list.forEach(account => {
        this.id_list.push(account.ACC_ID);
        this.src_id_list.push(account.ACC_ID);
        this.trg_id_list.push(account.ACC_ID);
      });
    });
  }

  onChangeSRCId(idValue: number) {
  }

  onChangeTRGId(idValue: number) {
  }

  transferAmount() {
    var account_data = {
      'SRC_ACC_ID': this.transferForm.get('SRC_ACC_ID').value,
      'TRG_ACC_ID': this.transferForm.get('TRG_ACC_ID').value,
      'TransferAmount': this.transferForm.get('TransferAmount').value,
      'Operation': 'TRANSFER'
    };

    this.src_account.ACC_ID = this.transferForm.get('SRC_ACC_ID').value;
    this.trg_account.ACC_ID = this.transferForm.get('TRG_ACC_ID').value;

    //FETCH CURRENT BALANCE FOR BOTH ACCOUNTS
    this.accountService.getAccountByACCId(this.src_account.ACC_ID).subscribe((res) => {
      this.src_account = res.body;
    });
    this.accountService.getAccountByACCId(this.trg_account.ACC_ID).subscribe((res) => {
      this.trg_account = res.body;
    });

    this.accountOpsService.transferByACCId(account_data).subscribe((res)=> {
      this.latest_src_amount = res.LATEST_SRC_AMOUNT;
      this.latest_trg_amount = res.LATEST_TRG_AMOUNT;

      this.showReciept = true;

      this.toastr.success('Amount transfer completed successfully', 'Success');
    },
    (error) => {
      this.toastr.error('Transfer not allowed, please choose smaller amount', 'Error');
    }
    );
  }

  resetForm(form: FormGroup) {
    this.showReciept = true;
    form.reset();
  }

}
