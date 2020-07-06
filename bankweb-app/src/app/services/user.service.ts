import { Injectable } from '@angular/core';
import { Profile } from '../models/profile';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  getPofiles(): Profile[] {
    let profiles = [
        new Profile('bankExe', 'Bank Account Executive'),
        new Profile('cashier', 'Cashier/Teller')
    ]
    return profiles;
  }

  createUser(user: User) {
    //Log user data in console
    console.log(JSON.stringify(user));
    console.log("User Name: " + user.userName);
    console.log("User Name: " + user.password);
    console.log("Profile Id: " + user.profile.prId);
    console.log("Profile Name: " + user.profile.prName);
  }

}
