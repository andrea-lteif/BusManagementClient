import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Route } from '@angular/router';
import { finalize } from 'rxjs';
import { RoutesService } from '../../routes/services/routes.service';
import { Station } from '../models/station';
import { StationsService } from '../services/stations.service';
@Component({
  selector: 'app-station',
  templateUrl: './station.component.html',
  styleUrls: ['./station.component.sass']
})

export class StationComponent implements OnInit{

  stationForm !: FormGroup;
  station!: Station;
  action!:string;
  dialogTitle!: string;
  submitting : boolean = false;
  routes : Route[]=[];

  constructor( public dialogRef: MatDialogRef<StationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private routesService : RoutesService,
    private fb : FormBuilder, private snackBar: MatSnackBar,
    private stationsService : StationsService){
      
  }

  ngOnInit() : void {                                                                                                                    
    this.stationForm = this.fb.group({
      name: new FormControl<string | null>(null, [Validators.required]),
      orderNumber: new FormControl<number | null>(null, [Validators.required]),
      duration: new FormControl<number | null>(null, [Validators.required]),
      stopTime: new FormControl<number | null>(null, [Validators.required]),
      price: new FormControl<number | null>(null, [Validators.required]),
      location: new FormControl<string | null>(null, [Validators.required]),
      routeId : new FormControl<number[] | []>([])
    })
    this.station=null;
    this.action = this.data.action;
    if(this.action == "edit"){
      this.dialogTitle = "Edit";
      this.station = this.data.advanceTable;
      this.stationFormControl['name'].setValue(this.station.name);
      this.stationFormControl['location'].setValue(this.station.location);
      this.stationFormControl['price'].setValue(this.station.price);
      this.stationFormControl['duration'].setValue(this.station.duration);
      this.stationFormControl['stopTime'].setValue(this.station.stopTime);
      this.stationFormControl['orderNumber'].setValue(this.station.orderNumber);
      this.stationFormControl['routeId'].setValue(this.station.routeId);

    }
    else{
      this.dialogTitle = "Add";
      this.station = this.data.advanceTable;
    }

    this.getRoutes();
  }

  get stationFormControl(){
    return this.stationForm.controls;
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
    if(this.stationForm?.invalid){
      return;
    }
    this.submitting = true;
    this.stationForm.disable();
    if(this.station.id != null){
      let stationModel : Station = {
        id: this.station.id,
        name: this.stationFormControl['name'].value,
        orderNumber : this.stationFormControl['orderNumber'].value,
        duration : this.stationFormControl['duration'].value,
        stopTime : this.stationFormControl['stopTime'].value,
        price : this.stationFormControl['price'].value,
        location: this.stationFormControl['location'].value,
        routeId: this.stationFormControl['routeId'].value,
        isActive : this.station.isActive
      }
      this.stationsService.update(stationModel).pipe(finalize(() => this.submitting=false)).subscribe(res => {
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
          this.stationForm.enable();
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
      let stationModel : any = {
        name: this.stationFormControl['name'].value,
        orderNumber : this.stationFormControl['orderNumber'].value,
        duration : this.stationFormControl['duration'].value,
        stopTime : this.stationFormControl['stopTime'].value,
        price : this.stationFormControl['price'].value,
        location: this.stationFormControl['location'].value,
        routeId: this.stationFormControl['routeId'].value,
        isActive : true
      }
      this.stationsService.create(stationModel).pipe(finalize(() => this.submitting=false)).subscribe(res => {
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
          this.stationForm.enable();
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
}
