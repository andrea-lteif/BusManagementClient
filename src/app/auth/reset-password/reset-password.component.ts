import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { CustomValidators } from '../validations/customValidators';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.sass']
})
export class ResetPasswordComponent {

  submitted = false;
  submitting = false;
  resetPasswordForm!: FormGroup;
  resetPassword!: any;
  fieldTextType: boolean = false;
  confirmFieldTextType: boolean = false;
  hide = true;

  passRequirement = {
    passwordMinLowerCase: 1,
    passwordMinNumber: 1,
    passwordMinSymbol: 1,
    passwordMinUpperCase: 1,
    passwordMinCharacters: 8
  };

  passRequirementCheck = [
    {name : 'passwordMinUpperCase', valid : false, text : '1 Upper case'},
    {name : 'passwordMinLowerCase', valid : false, text : '1 Lower case'},
    {name : 'passwordMinNumber', valid : false, text : '1 Number'},
    {name : 'passwordMinSymbol', valid : false, text : '1 Symbol'},
    {name : 'length', valid : false, text : 'Minimum length: 8 characters'}
    
  ];

  pattern = [
    `(?=([^a-z]*[a-z])\{${this.passRequirement.passwordMinLowerCase},\})`,
    `(?=([^A-Z]*[A-Z])\{${this.passRequirement.passwordMinUpperCase},\})`,
    `(?=([^0-9]*[0-9])\{${this.passRequirement.passwordMinNumber},\})`,
    `(?=(\.\*[\$\@\$\!\%\#\_\*\?\&])\{${
      this.passRequirement.passwordMinSymbol
    },\})`,
    `[A-Za-z\\d\$\@\$\!\%\#\_\*\?\&\.]{${
      this.passRequirement.passwordMinCharacters
    },}`
  ]
    .map(item => item.toString())
    .join("");

  constructor(
    public authService: AuthService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
   
  }

  ngOnInit(): void {
   
    this.resetPasswordForm = this.fb.group({
      newPassword: new FormControl<string | null>(null, [Validators.required, Validators.pattern(this.pattern),
        CustomValidators.matchValidator('newConfirmPassword', true)
      ]),
      newConfirmPassword:  new FormControl<string | null>(null, [Validators.required, CustomValidators.matchValidator('newPassword')]),
    });
   
  }

  onPasswordKeyUp(event : any)
  {
      let input = event.target as HTMLInputElement;
      this.passRequirementCheck[0].valid = this.containsUpper(input.value);
      this.passRequirementCheck[1].valid = this.containsLower(input.value);
      this.passRequirementCheck[2].valid = this.containsOneNumber(input.value);
      this.passRequirementCheck[3].valid = this.containsOneSymbol(input.value);
      this.passRequirementCheck[4].valid = this.containsMinLength(input.value);
  }

  containsUpper(str : string) {
    return (/[A-Z]/.test(str));
  }

  containsLower(str : string) {
    return (/[a-z]/.test(str));
  }

  containsOneNumber(str : string) {
    return (/[0-9]/.test(str));
  }

  containsOneSymbol(str : string) {
    return (/[\$\@\$\!\%\#\_\*\?\&]/.test(str));
  }

  containsMinLength(str : string) {
    return str.length >= 8;
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  toggleConfirmFieldTextType() {
    this.confirmFieldTextType = !this.confirmFieldTextType;
  }

  get resetPasswordFormControl(){
    return this.resetPasswordForm.controls;
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, "", {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }

  Submit()
  {
    this.submitted = true;
    if(this.resetPasswordForm.invalid)
    {
      return;
    }
    this.submitting=true;
    let t = this.route.snapshot.paramMap.get('token');
    let body: any = {
      userId: this.route.snapshot.paramMap.get('id'),
      token: atob(t!),
      newPassword: this.resetPasswordFormControl["newPassword"].value,
      newConfirmPassword: this.resetPasswordFormControl["newConfirmPassword"].value,
    }
    this.authService.resetPassword(body).pipe(finalize(() => this.submitting=false)).subscribe(resp=>{
      if(resp.success)
      {
        this.resetPasswordForm.reset();
        this.showNotification(
          "snackbar-success",
          resp.message,
          "bottom",
          "center"
        );        
        this.router.navigate(['/auth/login']);
      }
      else
      {
        this.showNotification(
          "snackbar-danger",
          resp.message,
          "bottom",
          "center"
        );      
      }
    })
  }
}
