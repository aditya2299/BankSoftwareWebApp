import { Account } from './../models/account';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

const httpOptions ={
  headers: new HttpHeaders({
    'Content-type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  baseUrl:string = 'http://127.0.0.1:5000/account';
  constructor(private http: HttpClient) { }

  postAccount(acc: Account):Observable<any> {
    return this.http.post<Account>(this.baseUrl,acc,httpOptions);
  }

  getActiveAccounts():Observable<Account[]> {
    return this.http.get<Account[]>(`${this.baseUrl}`+"/active",httpOptions);
  }

  getAllAccounts():Observable<Account[]> {
    return this.http.get<Account[]>(this.baseUrl,httpOptions);
  }

  getAccountByACCId(id: number):Observable<HttpResponse<Account>> {
    return this.http.get<Account>(`${this.baseUrl}`+"/"+`${id}`, { observe: 'response'})
    .pipe(
      catchError((err) => {
        console.log('error caught in service')
        return throwError(err);    //Rethrow it back to component
      }));
  }

  deleteAccount(id: number):Observable<any> {
    return this.http.delete<Account>(`${this.baseUrl}`+"/"+`${id}`, httpOptions);
  }


}
