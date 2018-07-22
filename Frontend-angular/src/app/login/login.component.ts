import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Http } from '@angular/http';
//import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;

  constructor(
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private http:Http
      ) {}

  ngOnInit() {
      this.loginForm = this.formBuilder.group({
          email: ['', Validators.required],
          password: ['', Validators.required]
      });

      // reset login status

      // get return url from route parameters or default to '/'
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit() {
      this.submitted = true;
      const email = this.loginForm.value.email;
      const pass1 = this.loginForm.value.password;
      const data = {'email': email , 'password': pass1};
      console.log (data);
      this.http.post('http://localhost:8080/user/login', data)
      .subscribe(res => {
        const state = res.json().state;
        //const message = res.json().message;
        if (state === 1) {
        alert ('Login Success');
        this.router.navigate(['home']);
        } else {
        alert ('Login Failed');
          }
      });
      // stop here if form is invalid
      if (this.loginForm.invalid) {
          return;
      }
  }
}