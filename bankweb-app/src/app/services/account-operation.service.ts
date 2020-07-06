import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpResponse, HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Account } from './../models/account';


const httpOptions ={
  headers: new HttpHeaders({
    'Content-type': 'application/json'
  })
}


@Injectable({
  providedIn: 'root'
})
export class AccountOperationService {

  baseUrl:string = 'http://127.0.0.1:5000/account';
  constructor(private http: HttpClient) { }

  getAccountByACCId(id: number):Observable<HttpResponse<Account>> {
    return this.http.get<Account>(`${this.baseUrl}`+"/"+`${id}`, { observe: 'response'})
    .pipe(
      catchError((err) => {
        console.log('error caught in service')
        return throwError(err);    //Rethrow it back to component
      }));
  }

  getAccountsByCUSTId(id: number):Observable<HttpResponse<Account[]>> {
    return this.http.get<Account[]>(`${this.baseUrl}`+"/CUSTID/"+`${id}`, { observe: 'response'})
    .pipe(
      catchError((err) => {
        console.log('error caught in service')
        return throwError(err);    //Rethrow it back to component
      }));
  }

  getAccountsBySSNId(id: number):Observable<HttpResponse<Account[]>> {
    return this.http.get<Account[]>(`${this.baseUrl}`+"/SSNID/"+`${id}`, { observe: 'response'})
    .pipe(
      catchError((err) => {
        console.log('error caught in service')
        return throwError(err);    //Rethrow it back to component
      }));
  }

  depositByACCId(updated_acc: Account):Observable<any> {
    return this.http.put<Account>(this.baseUrl,updated_acc,httpOptions);
  }

  withdrawByACCId(updated_acc: Account):Observable<any> {
    return this.http.put<Account>(this.baseUrl,updated_acc,httpOptions);
  }

  transferByACCId(updated_acc: any):Observable<any> {
    return this.http.put<Account>(this.baseUrl,updated_acc,httpOptions);
  }

  getStatements(statement_model: any):Observable<any> {
    return this.http.post<Account>(`${this.baseUrl}`+"/transaction",statement_model,httpOptions);
  }

}
