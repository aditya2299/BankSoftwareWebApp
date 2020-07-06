import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ClarityModule } from '@clr/angular';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material/material.module';
import { ToastrModule } from 'ngx-toastr';


import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CreateCustomerComponent } from './components/dashboard/customer/create-customer/create-customer.component';
import { UpdateCustomerComponent } from './components/dashboard/customer/update-customer/update-customer.component';
import { DeleteCustomerComponent } from './components/dashboard/customer/delete-customer/delete-customer.component';
import { StatusCustomerComponent } from './components/dashboard/customer/status-customer/status-customer.component';
import { CreateAccountComponent } from './components/dashboard/account/create-account/create-account.component';
import { DeleteAccountComponent } from './components/dashboard/account/delete-account/delete-account.component';
import { StatusAccountComponent } from './components/dashboard/account/status-account/status-account.component';
import { DepositComponent } from './components/dashboard/deposit/deposit.component';
import { WithdrawComponent } from './components/dashboard/withdraw/withdraw.component';
import { TransferComponent } from './components/dashboard/transfer/transfer.component';
import { StatementComponent } from './components/dashboard/statement/statement.component';
import { AccountDetailsComponent } from './components/dashboard/account-details/account-details.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    CreateCustomerComponent,
    UpdateCustomerComponent,
    DeleteCustomerComponent,
    StatusCustomerComponent,
    CreateAccountComponent,
    DeleteAccountComponent,
    StatusAccountComponent,
    DepositComponent,
    WithdrawComponent,
    TransferComponent,
    StatementComponent,
    AccountDetailsComponent
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    ClarityModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
