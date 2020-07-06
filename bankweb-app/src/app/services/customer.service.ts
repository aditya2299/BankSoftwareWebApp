import { Customer } from './../models/customer';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

const httpOptions ={
  headers: new HttpHeaders({
    'Content-type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  baseUrl:string = 'http://127.0.0.1:5000/customer';
  constructor(private http: HttpClient) { }

  getCustomers():Observable<Customer[]> {
    return this.http.get<Customer[]>(this.baseUrl);
  }

  postCustomer(cust: Customer):Observable<any> {
    return this.http.post<Customer>(this.baseUrl,cust,httpOptions);
  }

  updateCustomer(cust: Customer):Observable<any> {
    return this.http.put<Customer>(this.baseUrl,cust,httpOptions);
  }

  deleteCustomer(id: number):Observable<any> {
    return this.http.delete<Customer>(`${this.baseUrl}`+"/CUSTID/"+`${id}`, httpOptions);
  }

  getCustomerBySSNId(id: number):Observable<HttpResponse<Customer>> {
    return this.http.get<Customer>(`${this.baseUrl}`+"/SSNID/"+`${id}`, { observe: 'response'})
    .pipe(
      catchError((err) => {
        console.log('error caught in service')
        return throwError(err);    //Rethrow it back to component
      }));
  }

  getCustomerByCUSTId(id: number):Observable<HttpResponse<Customer>> {
    return this.http.get<Customer>(`${this.baseUrl}`+"/CUSTID/"+`${id}`, { observe: 'response'})
    .pipe(
      catchError((err) => {
        console.log('error caught in service')
        return throwError(err);    //Rethrow it back to component
      }));
  }

}
