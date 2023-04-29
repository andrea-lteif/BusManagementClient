import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent {
  public show: boolean = false;
  public loginForm: FormGroup | any;
  formSubmitted : boolean = false;
  loggingIn : boolean = false;
  error : string = '';
  hide = true;


  constructor(public authService: AuthService, private fb: FormBuilder, private router : Router) {
      this.loginForm = this.fb.group({
        email: ['', [Validators.required]],
        password: ['', [Validators.required]]
      });
      
  }

  ngOnInit() {
  }

  get f()
  {
     return this.loginForm.controls;
  }
  

  showPassword() {
    this.show = !this.show;
  }
    

  // Simple Login
  login() {
    this.error = '';
    this.formSubmitted = true;
    if(this.loginForm?.invalid)
    {
       return;
    }

    this.loggingIn = true;
    let request = {
      login : this.f.email.value, 
      password : this.f.password.value
    }
    this.authService.SignIn(request)
    .pipe(finalize(()=>{
      this.loggingIn = false;
    }))
    .subscribe(resp=>{
      if(resp.success)
      {
          let user : User = resp.result;
          sessionStorage.setItem('user', JSON.stringify(user));
          this.authService.setUser(user);
          this.router.navigate(['/schedules/welcome']);
      }
      else
      {
         this.error = 'Invalid Credentials'
      }
    });
  }

}
