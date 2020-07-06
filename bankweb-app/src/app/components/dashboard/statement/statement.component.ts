import { Account } from './../../../models/account';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import { AccountOperationService } from 'src/app/services/account-operation.service';

@Component({
  selector: 'app-statement',
  templateUrl: './statement.component.html',
  styleUrls: ['./statement.component.css']
})
export class StatementComponent implements OnInit {

  statementForm: FormGroup;
  showForm: boolean = true;
  switchminiform: boolean;
  displayminiform: boolean = false;
  acc_list:Account[];
  acc_id_list:number[] = [];
  statement_list: any[] = [];
  transaction_nos = [1,2,3,4,5,6,7,9,10];
  constructor(private formBuilder: FormBuilder, private accountService: AccountService, private accountOpsService: AccountOperationService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.statementForm = this.formBuilder.group({
      ACC_ID: ['', Validators.required],
      method: ['', Validators.required],
      TRANS_NO: ['', Validators.required],
      START_DATE: ['',  Validators.required],
      END_DATE: ['', Validators.required]
    });
    this.fillData();
    this.onChangeRadio();
  }

  fillData() {
    this.accountService.getActiveAccounts().subscribe((res) => {
      this.acc_list = res;
      this.acc_list.forEach(account => {
        this.acc_id_list.push(account.ACC_ID);
      });
    });
  }

  onChangeRadio() {
    this.statementForm.get('method').valueChanges.subscribe(() => {
      if (this.statementForm.get('method').value == 'no_of_trans') {
        this.statementForm.get('TRANS_NO').enable();
        this.switchminiform = true;
        this.displayminiform = true;
        this.statementForm.get('START_DATE').disable();
        this.statementForm.get('END_DATE').disable();
      }
      else if (this.statementForm.get('method').value == 'date_gap') {
        this.statementForm.get('START_DATE').enable();
        this.statementForm.get('END_DATE').enable();
        this.switchminiform = false;
        this.displayminiform = true;
        this.statementForm.get('TRANS_NO').disable();
      }
      else {
        this.displayminiform = false;
      }
    });
  }

  onSubmit() {
    var statement_model = {
      'ACC_ID': this.acc_id_list[this.statementForm.get('ACC_ID').value],
      'Method': this.statementForm.get('method').value,
      'TRANS_NO': '',
      'START_DATE': '',
      'END_DATE': '',
    };
    if (this.switchminiform) {
      statement_model.TRANS_NO = this.statementForm.get('TRANS_NO').value;
    }
    else {
      statement_model.START_DATE = this.statementForm.get('START_DATE').value.replace(/(\d\d)\/(\d\d)\/(\d{4})/, "$3-$1-$2");
      statement_model.END_DATE = this.statementForm.get('END_DATE').value.replace(/(\d\d)\/(\d\d)\/(\d{4})/, "$3-$1-$2");
    }

    if ((this.statementForm.get('START_DATE').valid && this.statementForm.get('END_DATE').valid) || this.statementForm.get('TRANS_NO').value != '') {
      this.accountOpsService.getStatements(statement_model).subscribe((res) => {
        this.statement_list = res;
        this.showForm = false;
      },
      );
    }
    else {
      return false;
    }
  }

  getNewData() {
    window.location.reload();
  }

}
