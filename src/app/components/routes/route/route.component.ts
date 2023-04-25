import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';
import { Route } from '../models/route';
import { RoutesService } from '../services/routes.service';

@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.sass']
})


export class RouteComponent implements OnInit{

  routeForm !: FormGroup;
  route!: Route;
  action!:string;
  dialogTitle!: string;
  submitting : boolean = false;

  constructor( public dialogRef: MatDialogRef<RouteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb : FormBuilder,     private snackBar: MatSnackBar,
    private routesService : RoutesService){
      
  }

  ngOnInit() : void {                                                                                                                    
    this.routeForm = this.fb.group({
      name: new FormControl<string | null>(null, [Validators.required]),
      price: new FormControl<number | null>(null, [Validators.required]),
    })
    this.route=null;
    this.action = this.data.action;
    if(this.action == "edit"){
      this.dialogTitle = "Edit";
      this.route = this.data.advanceTable;
      this.routeFormControl['name'].setValue(this.route.name);
      this.routeFormControl['price'].setValue(this.route.price);
    }
    else{
      this.dialogTitle = "Add";
      this.route = this.data.advanceTable;
    }
  }

  get routeFormControl(){
    return this.routeForm.controls;
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
    if(this.routeForm?.invalid){
      return;
    }
    this.submitting = true;
    this.routeForm.disable();
    if(this.route.id != null){
      let routeModel : Route = {
        id: this.route.id,
        name: this.routeFormControl['name'].value,
        duration : this.route.duration,
        price : this.routeFormControl['price'].value,
        isActive : this.route.isActive
      }
      this.routesService.update(routeModel).pipe(finalize(() => this.submitting=false)).subscribe(res => {
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
          this.routeForm.enable();
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
      let routeModel : any = {
        name: this.routeFormControl['name'].value,
        price : this.routeFormControl['price'].value,
        isActive : true
      }
      this.routesService.create(routeModel).pipe(finalize(() => this.submitting=false)).subscribe(res => {
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
          this.routeForm.enable();
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
