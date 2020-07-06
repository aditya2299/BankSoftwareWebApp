import { LoginService } from './../../services/login.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Profile } from 'src/app/models/profile';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isValidFormSubmitted = false;
	allProfiles: Profile[];
  loginForm: FormGroup;
  show_error:boolean = false;

  constructor(private formBuilder: FormBuilder, private userService: UserService, private loginService: LoginService, private router: Router) {
    if (this.loginService.isAlreadyLogin()) {
      this.router.navigate([`/dashboard`], { replaceUrl: true });
    }
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      profile: [null, [Validators.required]],
      userName: ['', [ Validators.required,Validators.maxLength(10),Validators.pattern('^[a-zA-Z0-9]+$') ] ],
      password: ['', [ Validators.required,Validators.maxLength(10), Validators.pattern('^[a-zA-Z0-9]+$') ] ],
    });
    this.allProfiles = this.userService.getPofiles();
  }

  get profile() {
		return this.loginForm.get('profile');
	}
	get userName() {
		return this.loginForm.get('userName');
	}

  onLogin() {
    this.isValidFormSubmitted = false;


    if (this.loginForm.valid) {
      this.isValidFormSubmitted = true;
      let newUser: User = this.loginForm.value;
      newUser.timestamp = new Date();

      //CALL A SERVICE TO VALIDATE IF A USER IS IN DATABASE
      this.loginService.postQuery(newUser).subscribe(res => {
        this.router.navigate([`/dashboard`], { replaceUrl: true });
        return;
      },
      (error) => {
        //console.log("Customer Not Found");
        this.show_error = true;
        this.resetForm(this.loginForm);
        throw error;
      }
      );
    }


    else {
      this.show_error = true;
      this.resetForm(this.loginForm);
			return;
		}
  }

  resetForm(form: FormGroup) {
		form.reset();
	}

}
