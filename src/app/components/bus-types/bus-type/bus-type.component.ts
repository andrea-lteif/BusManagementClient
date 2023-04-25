import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';
import { BusType } from '../models/busType';
import { BusTypesService } from '../services/bus-types.service';

@Component({
  selector: 'app-bus-type',
  templateUrl: './bus-type.component.html',
  styleUrls: ['./bus-type.component.sass']
})
export class BusTypeComponent implements OnInit{

  busTypeForm !: FormGroup;
  busType!: BusType;
  action!:string;
  dialogTitle!: string;
  submitting : boolean = false;

  constructor( public dialogRef: MatDialogRef<BusTypeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb : FormBuilder,     private snackBar: MatSnackBar,
    private busTypesService : BusTypesService){
      
  }

  ngOnInit() : void {                                                                                                                    
    this.busTypeForm = this.fb.group({
      name: new FormControl<string | null>(null, [Validators.required]),
      seatedSeats: new FormControl<number | null>(null, [Validators.required]),
      standingSeats: new FormControl<number | null>(null, [Validators.required]),
    })
    this.busType = null;
    this.action = this.data.action;
    if(this.action == "edit"){
      this.dialogTitle = "Edit";
      this.busType = this.data.advanceTable;
      this.busTypeFormControl['name'].setValue(this.busType.name);
      this.busTypeFormControl['standingSeats'].setValue(this.busType.standingSeats);
      this.busTypeFormControl['standingSeats'].disable();
      this.busTypeFormControl['seatedSeats'].setValue(this.busType.seatedSeats);
      this.busTypeFormControl['seatedSeats'].disable();
    }
    else{
      this.dialogTitle = "Add";
      this.busType = this.data.advanceTable;
    }
  }

  get busTypeFormControl(){
    return this.busTypeForm.controls;
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
    if(this.busTypeForm?.invalid){
      return;
    }
    this.submitting = true;
    this.busTypeForm.disable();
    if(this.busType.id != null){
      let busTypeModel : BusType = {
        id: this.busType.id,
        name: this.busTypeFormControl['name'].value,
        seatedSeats : this.busTypeFormControl['seatedSeats'].value,
        standingSeats : this.busTypeFormControl['standingSeats'].value,
        isActive : this.busType.isActive
      }
      this.busTypesService.update(busTypeModel).pipe(finalize(() => this.submitting=false)).subscribe(res => {
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
          this.busTypeForm.enable();
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
        name: this.busTypeFormControl['name'].value,
        seatedSeats : this.busTypeFormControl['seatedSeats'].value,
        standingSeats : this.busTypeFormControl['standingSeats'].value,
        isActive : true
      }
      this.busTypesService.create(busTypeModel).pipe(finalize(() => this.submitting=false)).subscribe(res => {
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
          this.busTypeForm.enable();
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
