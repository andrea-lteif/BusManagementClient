import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../models/user';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersService } from '../services/users.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.sass']
})

export class UserComponent implements OnInit{

  userForm !: FormGroup;
  user!: User;
  action!:string;
  dialogTitle!: string;
  submitting : boolean = false;

  constructor( public dialogRef: MatDialogRef<UserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb : FormBuilder,     private snackBar: MatSnackBar,
    private usersService : UsersService){
      
  }

  ngOnInit() : void {                                                                                                                    
    this.userForm = this.fb.group({
      firstName: new FormControl<string | null>(null, [Validators.required]),
      lastName: new FormControl<string | null>(null, [Validators.required]),
      email: new FormControl<string | null>(null, [Validators.required]),
      phoneNumber: new FormControl<number | null>(null, [Validators.required])
    })
    this.user = null;
    this.action = this.data.action;
    if(this.action == "edit"){
      this.dialogTitle = "Edit";
      this.user = this.data.advanceTable;
      this.userFormControl['firstName'].setValue(this.user.firstName);
      this.userFormControl['lastName'].setValue(this.user.lastName);
      this.userFormControl['email'].setValue(this.user.email);
      this.userFormControl['email'].disable();
      this.userFormControl['phoneNumber'].setValue(this.user.phoneNumber);
      this.userFormControl['phoneNumber'].disable();
    }
    else{
      this.dialogTitle = "Add";
      this.user = this.data.advanceTable;
    }
  }

  get userFormControl(){
    return this.userForm.controls;
  }

  onNoClick(): void {
    this.dialogRef.close();
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
    if(this.userForm?.invalid){
      return;
    }
    this.submitting = true;
    this.userForm.disable();
    if(this.user.id != null){
      let userModel : User = {
        id: this.user.id,
        firstName: this.userFormControl['firstName'].value,
        lastName : this.userFormControl['lastName'].value,
        email : this.userFormControl['email'].value,
        phoneNumber: this.userFormControl['phoneNumber'].value,
        isActive : this.user.isActive
      }
      this.usersService.update(userModel).pipe(finalize(() => this.submitting=false)).subscribe(res => {
        if(res.success){
          this.onNoClick();
          this.showNotification(
            "snackbar-success",
            res.message,
            "bottom",
            "center"
          );
        }
        else{
          this.userForm.enable();
          this.showNotification(
            "snackbar-danger",
            res.message,
            "bottom",
            "center"
          );
        }
      })
    }
    else {
      let busTypeModel : any = {
        firstName: this.userFormControl['firstName'].value,
        lastName : this.userFormControl['lastName'].value,
        email : this.userFormControl['email'].value,
        phoneNumber: this.userFormControl['phoneNumber'].value,
        isActive : true
      }
      this.usersService.create(busTypeModel).pipe(finalize(() => this.submitting=false)).subscribe(res => {
        if(res.success){
          this.onNoClick();
          this.showNotification(
            "snackbar-success",
            res.message,
            "bottom",
            "center"
          );
        }
        else{
          this.userForm.enable();
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
}
