import { CustomerService } from './../../../../services/customer.service';
import { Customer } from './../../../../models/customer';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocationService } from 'src/app/services/location.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.css']
})
export class CreateCustomerComponent implements OnInit {

  isValidFormSubmitted = false;
  stateInfo: any[] = [];
  countryInfo: any[] = [];
  cityInfo: any[] = [];
  createCustomerForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private location: LocationService, private customerService: CustomerService, private toastr: ToastrService) { }

  ngOnInit(): void {

    this.getLocations();

    this.createCustomerForm = this.formBuilder.group({
      SSN_ID: ['', [ Validators.required,Validators.maxLength(9),Validators.minLength(9),Validators.pattern('^[0-9]+$') ] ],
      Name: ['', [ Validators.required, Validators.pattern('^[a-z A-Z]+$') ] ],
      Age: ['', [ Validators.required, Validators.maxLength(3), Validators.pattern('^[0-9]+$') ] ],
      Address_1: ['', [ Validators.required , Validators.pattern('^[a-zA-Z0-9,/ ]+$') ] ],
      Address_2: ['', [ Validators.required , Validators.pattern('^[a-zA-Z0-9,/ ]+$') ] ],
      State: ['', [ Validators.required ] ],
      City: ['', [ Validators.required ] ],
    });
  }

  getLocations(){
    this.location.allCountries().
    subscribe(
      data2 => {
        this.countryInfo=data2.Countries;
      },
      err => console.log(err),
      () => {
        this.onChangeCountry(100);
      }
    )
  }

  onChangeCountry(countryValue) {
    this.stateInfo=this.countryInfo[countryValue].States;
  }

  onChangeState(stateValue) {
    this.cityInfo=this.stateInfo[stateValue].Cities;
  }

  onSubmit() {
    this.isValidFormSubmitted = false;

    if(this.createCustomerForm.valid) {
      this.isValidFormSubmitted = true;
      let newcust: Customer = this.createCustomerForm.value;
      var add1 = this.createCustomerForm.get('Address_1').value;
      var add2 = this.createCustomerForm.get('Address_2').value;
      newcust.Address = add1.concat(add2);
      newcust.timestamp = new Date();
      newcust.State = this.stateInfo[newcust.State]["StateName"];
      newcust.City = this.cityInfo[newcust.City];

      //SENDING DATA TO BACKEND VIA SERVICE
      this.customerService.postCustomer(newcust).subscribe(res => {
        if (res == 201) {
          this.toastr.success('Customer Created Successfully!', 'Success');
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
