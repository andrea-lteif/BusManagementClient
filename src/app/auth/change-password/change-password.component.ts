import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { CustomValidators } from '../validations/customValidators';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.sass']
})
export class ChangePasswordComponent {

  submitted = false;
  submitting = false;
  hide = true;
  hide1 = true;
  hide2 = true;
  changePasswordForm!: FormGroup;
  action!:any;
  dialogTitle!:any;
  changePassword!: any;
  fieldTextType: boolean = false;
  confirmFieldTextType: boolean = false;
  passRequirement = {
    passwordMinLowerCase: 1,
    passwordMinNumber: 1,
    passwordMinSymbol: 1,
    passwordMinUpperCase: 1,
    passwordMinCharacters: 8
  };

  passRequirementCheck = [
    {name : 'passwordMinUpperCase', valid : false, text : '1 upper case'},
    {name : 'passwordMinLowerCase', valid : false, text : '1 lower case'},
    {name : 'passwordMinNumber', valid : false, text : '1 number'},
    {name : 'passwordMinSymbol', valid : false, text : '1 symbol'},
    {name : 'length', valid : false, text : 'length 8'}
    
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
    public AuthService : AuthService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ChangePasswordComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,

  ) {
   
  }

  ngOnInit(): void {
   
    this.changePasswordForm = this.fb.group({
      currentPassword: new FormControl<string | null>(null, [Validators.required]),
      newPassword: new FormControl<string | null>(null, [Validators.required, Validators.pattern(this.pattern),
        CustomValidators.matchValidator('confirmPassword', true)
      ]),
      confirmPassword:  new FormControl<string | null>(null, [Validators.required, CustomValidators.matchValidator('newPassword')]),
    });
    this.action = this.data.action;
    this.dialogTitle = "Change Password";

   
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

  get changePasswordFormControl(){
    return this.changePasswordForm.controls;
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
    if(this.changePasswordForm.invalid)
    {
      return;
    }
    this.submitting=true;
    let body: any = {
      userId: this.AuthService.user?.id,
      currentPassword: this.changePasswordFormControl["currentPassword"].value,
      newPassword: this.changePasswordFormControl["newPassword"].value
    }
    this.AuthService.ChangePassword(body).pipe(finalize(() => this.submitting=false)).subscribe(resp=>{
      if(resp.success)
      {
        this.changePasswordForm.reset();
        this.dialogRef.close();
        this.showNotification(
          "snackbar-success",
          resp.message,
          "bottom",
          "center"
        );
      }
      else
      {
        this.showNotification(
          "snackbar-danger",
          resp.message,
          "bottom",
          "center"
        );      }
    })
  }

  closeChangePassword(){
    this.dialogRef.close();
  }
}
