import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomerService } from 'src/app/services/customer.service';
import { Customer } from 'src/app/models/customer';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delete-customer',
  templateUrl: './delete-customer.component.html',
  styleUrls: ['./delete-customer.component.css']
})
export class DeleteCustomerComponent implements OnInit {

  deleteform: FormGroup;
  proceed: boolean = false;
  completed: boolean = false;
  deleted: boolean = false;

  constructor(private formBuilder: FormBuilder, private customerService: CustomerService, private toastr: ToastrService) { }

  ngOnInit(): void {

    this.deleteform = this.formBuilder.group({
      identity: this.formBuilder.group({
        SSN_ID: ['', [ Validators.required, Validators.minLength(9), Validators.maxLength(9) ] ],
        CUST_ID: ['', [ Validators.required, Validators.minLength(9), Validators.maxLength(9) ] ],
      }),
      delcustform: this.formBuilder.group({
        SSN_ID: [{value: '', disabled: true}],
        CUST_ID: [{value: '', disabled: true}],
        CUST_NAME: [{value: '', disabled: true}],
        ADDRESS: [{value: '', disabled: true}],
        AGE: [{value: '', disabled: true}],
        DEL_MSG: []
      }),
    });

    this.onChangeIdentity();
  }

  onChangeIdentity() {
    this.deleteform.get('identity').get('SSN_ID').valueChanges
    .subscribe(() => {
      if (this.deleteform.get('identity').get('SSN_ID').valid) {
        this.deleteform.get('identity').get('CUST_ID').disable();
      }
    });
    this.deleteform.get('identity').get('CUST_ID').valueChanges
    .subscribe(() => {
      if (this.deleteform.get('identity').get('CUST_ID').valid) {
        this.deleteform.get('identity').get('SSN_ID').disable();
      }
    });
  }


  getCustomerData() {
    if (this.deleteform.get('identity').get('SSN_ID').value != '')
    {
      var id = this.deleteform.get('identity').get('SSN_ID').value;
      this.customerService.getCustomerBySSNId(id).subscribe((res) => {
        this.deleteform.get('delcustform').patchValue({
          SSN_ID: res.body.SSN_ID,
          CUST_ID: res.body.CUST_ID,
          CUST_NAME: res.body.Name,
          ADDRESS: res.body.Address,
          AGE: res.body.Age,
        });
        this.proceed = true;
      },
      (error) => {
        this.toastr.error('Customer Not Found!', 'Error');
        throw error;
      }
      );
    }
    else {
      var id = this.deleteform.get('identity').get('CUST_ID').value;
      this.customerService.getCustomerByCUSTId(id).subscribe((res) => {
        this.deleteform.get('delcustform').patchValue({
          SSN_ID: res.body.SSN_ID,
          CUST_ID: res.body.CUST_ID,
          CUST_NAME: res.body.Name,
          ADDRESS: res.body.Address,
          AGE: res.body.Age,
        });
        this.proceed = true;
      },
      (error) => {
        this.toastr.error('Customer Not Found!', 'Error');
        throw error;
      }
      );
    }
  }


  delete_cust() {
    var id = this.deleteform.get('delcustform').get('CUST_ID').value;
    //CAll A DELETE service
    this.customerService.deleteCustomer(id).subscribe(res => {
      if (res == 200) {
        this.toastr.success('Customer Deleted Successfully!', 'Success');
        this.deleted = true;
        this.completed = true;
      }
    });
  }


  resetForm(form: FormGroup) {
    form.reset();
    this.ngOnInit();
    this.proceed = false;
    this.completed = false;
    this.deleted = false;
	}

}
