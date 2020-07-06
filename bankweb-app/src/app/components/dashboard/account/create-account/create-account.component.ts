import { AccountService } from './../../../../services/account.service';
import { Account } from './../../../../models/account';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {

  isValidFormSubmitted = false;
  accountTypes: any[] = [];
  createAccountForm: FormGroup;
  constructor(private formBuilder: FormBuilder, private accountService: AccountService, private toastr: ToastrService) { }

  ngOnInit(): void {

    this.createAccountForm = this.formBuilder.group({
      CUST_ID: ['', [ Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern('^[0-9]+$') ] ],
      AccType: ['', [ Validators.required ] ],
      Amount: ['', [ Validators.required, Validators.pattern('^[0-9]+$') ] ],
    });

    this.accountTypes.push("Savings");
    this.accountTypes.push("Current");
  }

  onSubmit() {
    this.isValidFormSubmitted = false;

    if(this.createAccountForm.valid) {
      this.isValidFormSubmitted = true;
      let newacc: Account = this.createAccountForm.value;
      //Also added timestamp At Backend
      newacc.timestamp = new Date();

      //SENDING DATA TO BACKEND VIA SERVICE
      this.accountService.postAccount(newacc).subscribe(res => {
        if (res == 201) {
          this.toastr.success('Account Created Successfully!', 'Success');
        }
        else {
          //console.log("Some Error Occured");
        }
      });
    }
  }

  resetForm(form: FormGroup) {
		form.reset();
	}

}
