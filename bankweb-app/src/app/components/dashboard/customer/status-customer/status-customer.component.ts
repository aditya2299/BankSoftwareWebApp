import { Customer } from 'src/app/models/customer';
import { CustomerService } from 'src/app/services/customer.service';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-status-customer',
  templateUrl: './status-customer.component.html',
  styleUrls: ['./status-customer.component.css']
})
export class StatusCustomerComponent implements OnInit {

  customers: Customer[] = [];
  constructor(private customerService:CustomerService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.refreshAll();
  }

  refresh(record_val) {
    var id = this.customers[record_val].CUST_ID;
    this.customerService.getCustomerByCUSTId(id).subscribe((res) => {
      this.customers[record_val] = res.body;
      this.toastr.info('Customer Record Refreshed!', 'Info');
    });
  }

  refreshAll() {
    this.customerService.getCustomers().subscribe((res) => {
      this.customers = res;
      this.toastr.info('Customer List Refreshed!', 'Info');
    });
  }

}
