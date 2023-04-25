import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Ticket } from '../models/ticket';
import { Seat } from '../../seats/models/seat';
import { Route } from '@angular/router';
import { Bus } from '../../buses/models/bus';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Station } from '../../stations/models/station';
import { User } from '../../users/models/user';
import { TicketsService } from '../services/tickets.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BusesService } from '../../buses/services/buses.service';
import { RoutesService } from '../../routes/services/routes.service';
import { SeatsService } from '../../seats/services/seats.service';
import { StationsService } from '../../stations/services/stations.service';
import { UsersService } from '../../users/services/users.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.sass']
})

export class TicketComponent implements OnInit{

  ticketForm !: FormGroup;
  ticket!: Ticket;
  action!:string;
  dialogTitle!: string;
  submitting : boolean = false;
  routes : Route[]=[];
  buses : Bus[]=[];
  seats : Seat[] = [];
  stations : Station[] =[];
  users : User[] = [];

  constructor( public dialogRef: MatDialogRef<TicketComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private ticketsService : TicketsService,
    private fb : FormBuilder, private snackBar: MatSnackBar,
    private busesService : BusesService, private routesService : RoutesService,
    private seatsService : SeatsService, private stationsService : StationsService, private usersService : UsersService){
      
  }

  ngOnInit() : void {                                                                                                                    
    this.ticketForm = this.fb.group({
      stationId: new FormControl<number[] | []>([]),
      routeId : new FormControl<number[] | []>([], [Validators.required]),
      busId : new FormControl<number[] | []>([], [Validators.required]),
      seatId : new FormControl<number[] | []>([], [Validators.required]),
      userId : new FormControl<number[] | []>([], [Validators.required]),
    })
    this.ticket=null;
    this.action = this.data.action;
    if(this.action == "edit"){
      this.dialogTitle = "Edit";
      this.ticket = this.data.advanceTable;
      this.ticketFormControl['routeId'].setValue(this.ticket.routeId);
      this.ticketFormControl['busId'].setValue(this.ticket.busId);
      this.ticketFormControl['seatId'].setValue(this.ticket.seatId);
      this.ticketFormControl['userId'].setValue(this.ticket.userId);
    }
    else{
      this.dialogTitle = "Add";
      this.ticket = this.data.advanceTable;
    }

    this.getRoutes();
    this.getBuses();
    this.getSeats();
    this.getUsers();
    this.getStations();
  }

  get ticketFormControl(){
    return this.ticketForm.controls;
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
    if(this.ticketForm?.invalid){
      return;
    }
    this.submitting = true;
    this.ticketForm.disable();
    if(this.ticket.id != null){
      // let ticketModel : Ticket = {
      //   id: this.ticket.id,
      //   routeId: this.ticketFormControl['routeId'].value,
      //   busId: this.ticketFormControl['busId'].value,
      //   seatId: this.ticketFormControl['seatId'].value,
      //   userId: this.ticketFormControl['userId'].value,
      //   isActive: this.ticket.isActive,
      // }
      // this.ticketsService.update(ticketModel).pipe(finalize(() => this.submitting=false)).subscribe(res => {
      //   if(res.success){
      //     this.onNoClick();
      //     this.showNotification(
      //       "snackbar-success",
      //       res.message,
      //       "bottom",
      //       "center"
      //     );
      //   }
      //   else{
      //     this.ticketForm.enable();
      //     this.showNotification(
      //       "snackbar-danger",
      //       res.message,
      //       "bottom",
      //       "center"
      //     );
      //   }
      // })
    }
    else {
      let ticketModel : any = {
        routeId: this.ticketFormControl['routeId'].value,
        busId: this.ticketFormControl['busId'].value,
        seatId: this.ticketFormControl['seatId'].value,
        stationId: this.ticketFormControl['stationId'].value,
        userId: this.ticketFormControl['userId'].value,
        isActive : true
      }
      this.ticketsService.create(ticketModel).pipe(finalize(() => this.submitting=false)).subscribe(res => {
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
          this.ticketForm.enable();
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

  getStations(){
    this.stationsService.getAllActive().subscribe(res => {
      this.stations = res.result;
    })
  }

  getUsers(){
    this.usersService.getAllActive().subscribe(res => {
      this.users = res.result;
    })
  }

  getSeats(){
    this.seatsService.getAllActive().subscribe(res => {
      this.seats = res.result;
    })
  }
}
