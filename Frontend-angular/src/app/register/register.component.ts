import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Http } from '@angular/http';
//import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
      private formBuilder: FormBuilder,
      private router: Router,
      private http: Http,
     ) { }

  ngOnInit() {
      this.registerForm = this.formBuilder.group({
          firstName: ['', Validators.required],
          email: ['', [Validators.required, Validators.pattern("[^ @]*@[^ @]*")]],
          password: ['', [Validators.required, Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,100}$/)]],
          confirmpassword:['', Validators.required]
          },{validator: this.checkIfMatchingPasswords('password', 'confirmpassword')});
  }
  checkIfMatchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
      let passwordInput = group.controls[passwordKey],
          passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({notEquivalent: true}) ;
      }
      else {
          return passwordConfirmationInput.setErrors(null);
      }
    }
  }
  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  onSubmit() {
      this.submitted = true;
        const name = this.registerForm.value.firstName;
        const email = this.registerForm.value.email;
        const pass1 = this.registerForm.value.password;
        const data = {'name': name, 'email': email , 'password': pass1};
        console.log(data);
        this.http.post('http://localhost:8080/user/register', data)
        .subscribe( res => {
            const state = res.json().state;
            //const message = res.json().message;
            if (state === 1) {
              alert ('register success')
            } else {
              alert ('register failed')
            }
          });
        
      // stop here if form is invalid
      if (this.registerForm.invalid) {
          return;
      }
  }
}