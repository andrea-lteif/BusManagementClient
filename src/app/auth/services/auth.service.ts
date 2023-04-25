import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubject$ : BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  currentDate = new Date();
  constructor(
    private httpClient : HttpClient,
    public router: Router,
    public ngZone: NgZone,
) {
      let userStorage = sessionStorage.getItem('user');
      
      if(userStorage != '' && userStorage != null && userStorage != undefined)
      {
         let user : User = JSON.parse(userStorage);
         this.setUser(user);
      }
      
  }

  setUser(user : User | null)
  {
    this.userSubject$.next(user);
    
  }

  get user()
  {
     return this.userSubject$.value;
  }

  ngOnInit(): void { }

  // sign in function
  SignIn(authResponse : any) {
      const headers = {'content-type' : 'application/json'};
      let body = JSON.stringify(authResponse);
      return this.httpClient.post<any>(`${environment.apiDomainUrl}Account/Login`, body, {headers : headers});
  }
  // Sign up with email/password
  SignUp(email:any, password:any) {
   
  }

  // main verification function
  SendVerificationMail() {
    
  }
  
  ChangePassword(changePassowrd : any){
    const headers = {'content-type' : 'application/json'};
      let body = JSON.stringify(changePassowrd);
      return this.httpClient.post<any>(`${environment.apiDomainUrl}Account/ChangePassword`, body, {headers : headers});
  }

  Register(registerModel : any){
    const headers = {'content-type' : 'application/json'};
      let body = JSON.stringify(registerModel);
      return this.httpClient.post<any>(`${environment.apiDomainUrl}Account/Register`, body, {headers : headers});
  }

  ForgotPassword(passwordResetEmail:any) {
   
  }

  // Authentication for Login
  AuthLogin(provider:any) {
    
  }

  // Set user
  SetUserData(user:any) {
    //const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    
   
  }

  // Sign out
  SignOut() {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
       
      localStorage.clear();
      sessionStorage.clear();
      this.setUser(null);
      //this.cookieService.deleteAll('user', '/auth/login');
      this.router.navigate(['/auth/login']);
  }

  get isLoggedIn(): boolean {
  
    return (this.user != null) ? true : false;
  }

  isTokenExpired()
  {
    if ((this.currentDate.getTime() - new Date(this.user!.validTo)?.getTime()) <= 0)
    {
        return true;
    }
    return false;
  }

  sendPasswordResetCode(email:any){
      return this.httpClient.post<any>(`${environment.apiDomainUrl}Account/ResetPasswordToken?email=` + email, null);
  }

  resetPassword(data : any){
    const headers = {'content-type' : 'application/json'};
      let body = JSON.stringify(data);
      return this.httpClient.post<any>(`${environment.apiDomainUrl}Account/ResetPassword`, body, {headers : headers});
  }}
