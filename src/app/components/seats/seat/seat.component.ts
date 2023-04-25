import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';
import { Seat } from '../models/seat';
import { SeatsService } from '../services/seats.service';
import { BusTypesService } from '../../bus-types/services/bus-types.service';
@Component({
  selector: 'app-seat',
  templateUrl: './seat.component.html',
  styleUrls: ['./seat.component.sass']
})

export class SeatComponent implements OnInit{

  seatForm !: FormGroup;
  seat!: Seat;
  action!:string;
  dialogTitle!: string;
  submitting : boolean = false;
  busTypes: any[] =[];


  constructor( public dialogRef: MatDialogRef<SeatComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb : FormBuilder,     private snackBar: MatSnackBar,
    private seatsService : SeatsService, private busTypesService : BusTypesService,){
      
  }

  ngOnInit() : void {                                                                                                                    
    this.seatForm = this.fb.group({
      number: new FormControl<string | null>(null, [Validators.required]),
      statusStanding: new FormControl<boolean>(false, [Validators.required]),
      busTypeId: new FormControl<number | null>(null, [Validators.required])
    })
    this.seat=null;
    this.action = this.data.action;
    if(this.action == "edit"){
      this.dialogTitle = "Edit";
      this.seat = this.data.advanceTable;
      this.seatFormControl['number'].setValue(this.seat.number);
      this.seatFormControl['statusStanding'].setValue(this.seat.statusStanding);
      this.seatFormControl['busTypeId'].setValue(this.seat.busTypeId)
    }
    else{
      this.dialogTitle = "Add";
      this.seat = this.data.advanceTable;
    }
    this.getBusTypes();
  }

  get seatFormControl(){
    return this.seatForm.controls;
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
    if(this.seatForm?.invalid){
      return;
    }
    this.submitting = true;
    this.seatForm.disable();
    if(this.seat.id != null){
      let seatModel : Seat = {
        id: this.seat.id,
        busTypeId : this.seatFormControl['busTypeId'].value,
        number: this.seatFormControl['number'].value,
        statusStanding : this.seatFormControl['statusStanding'].value,
        isActive : this.seat.isActive
      }
      this.seatsService.update(seatModel).pipe(finalize(() => this.submitting=false)).subscribe(res => {
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
          this.seatForm.enable();
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
      let seatModel : any = {
        number: this.seatFormControl['number'].value,
        statusStanding : this.seatFormControl['statusStanding'].value,
        busTypeId : this.seatFormControl['busTypeId'].value,
        isActive : true
      }
      this.seatsService.create(seatModel).pipe(finalize(() => this.submitting=false)).subscribe(res => {
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
          this.seatForm.enable();
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
