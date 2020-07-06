import { Account } from './../../../../models/account';
import { AccountService } from './../../../../services/account.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.css']
})
export class DeleteAccountComponent implements OnInit {

  accountForm: FormGroup;
  acc_list: Account[];
  acc_id_list: number[] = [];
  acc_type_list: string[] = [];
  id: number;

  constructor(private formBuilder: FormBuilder, private accountService: AccountService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getAccounts();
    this.accountForm = this.formBuilder.group({
      'ACC_ID': [],
      'AccType': [{value: '', disabled: true}]
    });
  }

  getAccounts() {
    this.accountService.getActiveAccounts().subscribe((res) => {
      this.acc_list = res;
      this.acc_list.forEach(account => {
        this.acc_id_list.push(account.ACC_ID);
        this.acc_type_list.push(account.AccType);
      });
    });
  }

  onChangeId(idValue) {
    this.accountForm.patchValue({
      AccType: this.acc_type_list[idValue]
    });
    this.id = idValue;
  }

  onDelete() {
    this.accountService.deleteAccount(this.acc_id_list[this.id]).subscribe((res) => {
      this.toastr.success('Account Deleted Successfully!', 'Success');
      window.location.reload();
    });
  }

}
