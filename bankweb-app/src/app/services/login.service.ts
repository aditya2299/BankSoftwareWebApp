import { User } from './../models/user';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const httpOptions ={
  headers: new HttpHeaders({
    'Content-type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private currentUserSubject: BehaviorSubject<User>;
  baseUrl:string = 'http://127.0.0.1:5000/user';

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
  }

  postQuery(user: User):Observable<any> {
    return this.http.post<User>(this.baseUrl,user,httpOptions).pipe(map(user => {
      // store user details(crypted) in local storage to keep user logged in between page refreshes
      console.log(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
      return user;
    }),
    catchError((err) => {
      console.log('error caught in service')
      return throwError(err);    //Rethrow it back to component
    })
    );
  }

  isAlreadyLogin(): User {
    return this.currentUserSubject.value;
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

}
