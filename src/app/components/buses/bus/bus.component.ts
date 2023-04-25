import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';
import { BusTypesService } from '../../bus-types/services/bus-types.service';
import { RoutesService } from '../../routes/services/routes.service';
import { Bus } from '../models/bus';
import { BusesService } from '../services/buses.service';
@Component({
  selector: 'app-bus',
  templateUrl: './bus.component.html',
  styleUrls: ['./bus.component.sass']
})

export class BusComponent implements OnInit{

  busForm !: FormGroup;
  bus!: Bus;
  action!:string;
  dialogTitle!: string;
  submitting : boolean = false;
  busTypes: any[] =[];

  constructor( public dialogRef: MatDialogRef<BusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb : FormBuilder, private snackBar: MatSnackBar,
    private busTypesService : BusTypesService,
    private busesService : BusesService){
      
  }

  ngOnInit() : void {                                                                                                                    
    this.busForm = this.fb.group({
      name: new FormControl<string | null>(null, [Validators.required]),
      busTypeId: new FormControl<number | null>(null, [Validators.required]),
    })
    this.bus = null;
    this.action = this.data.action;
    if(this.action == "edit"){
      this.dialogTitle = "Edit";
      this.bus = this.data.advanceTable;
      this.busFormControl['name'].setValue(this.bus.name);
      this.busFormControl['busTypeId'].setValue(this.bus.busTypeId);
    }
    else{
      this.dialogTitle = "Add";
      this.bus = this.data.advanceTable;
    }
    this.getBusTypes();
  }

  get busFormControl(){
    return this.busForm.controls;
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
    if(this.busForm?.invalid){
      return;
    }
    this.submitting = true;
    this.busForm.disable();
    if(this.bus.id != null){
      let busModel : Bus = {
        id: this.bus.id,
        name: this.busFormControl['name'].value,
        busTypeId : this.busFormControl['busTypeId'].value,
        isActive : this.bus.isActive
      }
      this.busesService.update(busModel).pipe(finalize(() => this.submitting=false)).subscribe(res => {
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
          this.busForm.enable();
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
      let busModel : any = {
        name: this.busFormControl['name'].value,
        busTypeId : this.busFormControl['busTypeId'].value,
        isActive : true
      }
      this.busesService.create(busModel).pipe(finalize(() => this.submitting=false)).subscribe(res => {
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
          this.busForm.enable();
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

  getBusTypes(){
    this.busTypesService.getAllActive().subscribe(res => {
      this.busTypes = res.result;
    })
  }
}
