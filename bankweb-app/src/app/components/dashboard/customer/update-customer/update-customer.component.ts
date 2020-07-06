import { Customer } from './../../../../models/customer';
import { CustomerService } from './../../../../services/customer.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-customer',
  templateUrl: './update-customer.component.html',
  styleUrls: ['./update-customer.component.css']
})
export class UpdateCustomerComponent implements OnInit {

  updateform: FormGroup;
  proceed: boolean = false;
  completed: boolean = false;
  canSubmit: boolean = false;
  errorMessage: any;
  update_cust:Customer;

  constructor(private formBuilder: FormBuilder, private customerService: CustomerService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.update_cust = {};
    this.updateform = this.formBuilder.group({
      identity: this.formBuilder.group({
        SSN_ID: ['', [ Validators.required, Validators.minLength(9), Validators.maxLength(9) ] ],
        CUST_ID: ['', [ Validators.required, Validators.minLength(9), Validators.maxLength(9) ] ],
      }),
      newcustform: this.formBuilder.group({
        SSN_ID: [{value: '', disabled: true}],
        CUST_ID: [{value: '', disabled: true}],
        OLD_CUST_NAME: [{value: '', disabled: true}],
        NEW_CUST_NAME: ['', [Validators.pattern('^[a-z A-Z]+$')] ],
        OLD_ADDRESS: [{value: '', disabled: true}],
        NEW_ADDRESS: ['', [ Validators.pattern('^[a-zA-Z0-9,/ ]+$') ] ],
        OLD_AGE: [{value: '', disabled: true}],
        NEW_AGE: ['', [ Validators.maxLength(3), Validators.pattern('^[0-9]+$') ]],
      }),
    });

    this.onChangeIdentity();
    this.checkValid();
  }

  submit() {
    this.update_cust.SSN_ID = this.updateform.get('newcustform').get('SSN_ID').value;
    this.update_cust.CUST_ID = this.updateform.get('newcustform').get('CUST_ID').value;

    if (this.updateform.get('newcustform').get('NEW_CUST_NAME').value != '') {
      this.update_cust.Name = this.updateform.get('newcustform').get('NEW_CUST_NAME').value;
    }
    else {
      this.update_cust.Name = this.updateform.get('newcustform').get('OLD_CUST_NAME').value;
    }

    if (this.updateform.get('newcustform').get('NEW_ADDRESS').value != '') {
      this.update_cust.Address = this.updateform.get('newcustform').get('NEW_ADDRESS').value;
    }
    else {
      this.update_cust.Address = this.updateform.get('newcustform').get('OLD_ADDRESS').value;
    }

    if (this.updateform.get('newcustform').get('NEW_AGE').value != '') {
      this.update_cust.Age = this.updateform.get('newcustform').get('NEW_AGE').value;
    }
    else {
      this.update_cust.Age = this.updateform.get('newcustform').get('OLD_AGE').value;
    }

    //CAll AN UPDATE service
    this.customerService.updateCustomer(this.update_cust).subscribe(res => {
      if (res == 200) {
        this.completed = true;
        this.toastr.success('Customer Updated Successfully!', 'Success');
      }
    });
  }

  resetForm(form: FormGroup) {
    form.reset();
    this.ngOnInit();
    this.proceed = false;
    this.completed = false;
    this.canSubmit = false;
	}

  onChangeIdentity() {
    this.updateform.get('identity').get('SSN_ID').valueChanges
    .subscribe(() => {
      if (this.updateform.get('identity').get('SSN_ID').valid) {
        this.updateform.get('identity').get('CUST_ID').disable();
      }
    });
    this.updateform.get('identity').get('CUST_ID').valueChanges
    .subscribe(() => {
      if (this.updateform.get('identity').get('CUST_ID').valid) {
        this.updateform.get('identity').get('SSN_ID').disable();
      }
    });
  }

  checkValid() {
    ////console.log("hi");
    this.updateform.valueChanges
    .subscribe(() => {
      if(this.updateform.get('newcustform').get('NEW_CUST_NAME').value != '' ||
       this.updateform.get('newcustform').get('NEW_ADDRESS').value != '' ||
       this.updateform.get('newcustform').get('NEW_AGE').value != ''
      ) {
        if (this.updateform.valid) {
          this.canSubmit = true;
        }
    }
    else {
      this.canSubmit = false;
    }
    },
    (error) => {
      this.toastr.error('Invalid ID!', 'Error');
    }
    );
  }

  getCustomerData() {
    if (this.updateform.get('identity').get('SSN_ID').value != '')
    {
      var id = this.updateform.get('identity').get('SSN_ID').value;
      this.customerService.getCustomerBySSNId(id).subscribe((res) => {
        this.updateform.get('newcustform').patchValue({
          SSN_ID: res.body.SSN_ID,
          CUST_ID: res.body.CUST_ID,
          OLD_CUST_NAME: res.body.Name,
          OLD_ADDRESS: res.body.Address,
          OLD_AGE: res.body.Age,
        });
        this.proceed = true;
      },
      (error) => {
        throw error;
      }
      );
    }
    else if (this.updateform.get('identity').get('CUST_ID').value != ''){
      var id = this.updateform.get('identity').get('CUST_ID').value;
      this.customerService.getCustomerByCUSTId(id).subscribe((res) => {
        this.updateform.get('newcustform').patchValue({
          SSN_ID: res.body.SSN_ID,
          CUST_ID: res.body.CUST_ID,
          OLD_CUST_NAME: res.body.Name,
          OLD_ADDRESS: res.body.Address,
          OLD_AGE: res.body.Age,
        });
        this.proceed = true;
      },
      (error) => {
        //console.log("Customer Not Found");
        throw error;
      }
      );
    }
    else {
      return false;
    }
  }
}
