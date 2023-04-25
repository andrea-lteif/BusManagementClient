import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.sass']
})
export class SignUpComponent {

  public authForm: FormGroup | any;
  submitting : boolean = false;

  constructor(public authService : AuthService,  private snackBar: MatSnackBar, private fb: FormBuilder, private router: Router){
    this.authForm = this.fb.group({
      firstName: new FormControl<string | null>(null, [Validators.required]),
      lastName: new FormControl<string | null>(null, [Validators.required]),
      email: new FormControl<string | null>(null, [Validators.required]),
      phoneNumber: new FormControl<number | null>(null, [Validators.required])
    })
  }

  get authFormControl(){
    return this.authForm.controls;
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, "", {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }

  Submit(){
    if(this.authForm?.invalid){
      return;
    }

    this.submitting = true;
    this.authForm.disable();

    let registerModel = {
      firstName: this.authFormControl['firstName'].value,
      lastName: this.authFormControl['lastName'].value,
      email: this.authFormControl['email'].value,
      phoneNumber: this.authFormControl['phoneNumber'].value
    }
    this.authService.Register(registerModel).pipe(finalize(() => this.submitting=false)).subscribe(res => {
      if(res.success){
        this.router.navigate(['auth/login']);
        this.showNotification(
          "snackbar-success",
          "Please login in!",
          "bottom",
          "center"
        );
      }
      else{
        this.authForm.enable();
        this.showNotification(
          "snackbar-danger",
          res.message,
          "bottom",
          "center"
        );
      }
    })
  }
}
