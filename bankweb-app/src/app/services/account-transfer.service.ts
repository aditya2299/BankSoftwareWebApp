import { Account } from './../models/account';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountTransferService {

  private accountDataService = new BehaviorSubject<Account[]>([]);
  currentAccountData = this.accountDataService.asObservable();

  constructor() { }

  changeAccountData(description: Account[]) {
    this.accountDataService.next(description);
  }

}
