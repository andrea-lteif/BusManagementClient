import { Component, Inject, OnInit } from '@angular/core';
import { Trip } from '../models/trip';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TripsService } from '../services/trips.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BusesService } from '../../buses/services/buses.service';
import { RoutesService } from '../../routes/services/routes.service';
import { finalize } from 'rxjs';
import { Route } from '../../routes/models/route';
import { Bus } from '../../buses/models/bus';

@Component({
  selector: 'app-trip',
  templateUrl: './trip.component.html',
  styleUrls: ['./trip.component.sass']
})

export class TripComponent implements OnInit{

  tripForm !: FormGroup;
  trip!: Trip;
  action!:string;
  dialogTitle!: string;
  submitting : boolean = false;
  routes : Route[]=[];
  buses : Bus[]=[];

  constructor( public dialogRef: MatDialogRef<TripComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private tripsService : TripsService,
    private fb : FormBuilder, private snackBar: MatSnackBar,
    private busesService : BusesService, private routesService : RoutesService){
      
  }

  ngOnInit() : void {                                                                                                                    
    this.tripForm = this.fb.group({
      startTime: new FormControl<Date | null>(null, [Validators.required]),
      routeId : new FormControl<number | null>(null, [Validators.required]),
      busId : new FormControl<number | null>(null, [Validators.required]),
      endTime: new FormControl<Date | null>(null),

    })
    this.trip=null;
    this.action = this.data.action;
    if(this.action == "edit"){
      this.dialogTitle = "Edit";
      this.trip = this.data.advanceTable;
      this.tripFormControl['routeId'].setValue(this.trip.routeId);
      this.tripFormControl['busId'].setValue(this.trip.busId);
      this.tripFormControl['startTime'].setValue(this.trip.startTime);
      this.tripFormControl['endTime'].setValue(this.trip.endTime);
    }
    else{
      this.dialogTitle = "Add";
      this.trip = this.data.advanceTable;
    }

    this.getRoutes();
    this.getBuses();
  }

  get tripFormControl(){
    return this.tripForm.controls;
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
    if(this.tripForm?.invalid){
      return;
    }
    this.submitting = true;
    this.tripForm.disable();
    if(this.trip.id != null){
      let tripModel : Trip = {
        id: this.trip.id,
        routeId: this.tripFormControl['routeId'].value,
        busId: this.tripFormControl['busId'].value,
        startTime: this.tripFormControl['startTime'].value,
        endTime: this.trip.endTime,
        isActive: this.trip.isActive,
      }
      this.tripsService.update(tripModel).pipe(finalize(() => this.submitting=false)).subscribe(res => {
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
          this.tripForm.enable();
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
      let tripModel : any = {
        routeId: this.tripFormControl['routeId'].value,
        busId: this.tripFormControl['busId'].value,
        startTime: this.tripFormControl['startTime'].value,
        isActive : true
      }
      this.tripsService.create(tripModel).pipe(finalize(() => this.submitting=false)).subscribe(res => {
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
          this.tripForm.enable();
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

  getRoutes(){
    this.routesService.getAllActive().subscribe(res => {
      this.routes = res.result;
    })
  }

  getBuses(){
    this.busesService.getAllActive().subscribe(res => {
      this.buses = res.result;
    })
  }
}
