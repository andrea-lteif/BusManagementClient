import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.sass']
})
export class ForgotPasswordComponent {
  forgotPasswordForm!: FormGroup;
  formSubmitted : boolean = false;
  submitting = false;
  error : string = '';

  constructor(private authService: AuthService, private snackBar: MatSnackBar,
    private fb: FormBuilder
    ) {
      this.forgotPasswordForm = this.fb.group({
        email: new FormControl<string | null>(null, [Validators.required]),
      });
     }

  ngOnInit(): void {
  }

  get f()
  {
     return this.forgotPasswordForm.controls;
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, "", {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }

    Submit() {
    this.formSubmitted = true;
    if(this.forgotPasswordForm?.invalid)
    {
       return;
    }
    this.submitting=true;
    this.authService.sendPasswordResetCode(this.f["email"].value)
    .pipe(finalize(()=>{
      this.submitting=false
    }))
    .subscribe(resp=>{
      if(resp.success)
      {
        this.showNotification(
          "snackbar-success",
          resp.message,
          "bottom",
          "center"
        );      
      }
      else
      {
         this.error = 'Incorrect email'
      }
    });
  }
}
