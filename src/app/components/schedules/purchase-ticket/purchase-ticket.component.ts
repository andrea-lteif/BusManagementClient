import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketsService } from '../../tickets/services/tickets.service';
import { TripsService } from '../../trips/services/trips.service';
import { FormBuilder, FormControl, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { StationsService } from '../../stations/services/stations.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/auth/services/auth.service';
import { SeatsService } from '../../seats/services/seats.service';
import { Ticket } from '../../tickets/models/ticket';

@Component({
  selector: 'app-purchase-ticket',
  templateUrl: './purchase-ticket.component.html',
  styleUrls: ['./purchase-ticket.component.sass']
})
export class PurchaseTicketComponent {

  tripId!:string;
  trip!:any;
  stations!:any[];
  isLinear = false;
  foundPrice: boolean = false;
  price:number=0;
  stationId!:string;
  statusStanding!:boolean;
  user!:any;
  seatId!:number;
  isSeatAvailable!:boolean;
  HFormGroup1: FormGroup;
  HFormGroup2: FormGroup;
  VFormGroup1: FormGroup;
  VFormGroup2: FormGroup;

  constructor(private route: ActivatedRoute, private tripsService: TripsService, private fb : FormBuilder,
    private stationsService: StationsService, private ticketsService: TicketsService, private snackBar: MatSnackBar,
    private authService: AuthService, private SeatsService: SeatsService, private router: Router
    ){}

  ngOnInit() :void {
    this.tripId = this.route.snapshot.paramMap.get('id');
    this.user = this.authService.user;
    if(this.tripId!=null){
      this.getTripById(this.tripId);
    }
    this.HFormGroup1 = this.fb.group({
      startStationId : new FormControl<number | null>(null, Validators.required),
      endStationId : new FormControl<number | null>(null, Validators.required),
      statusStanding : new FormControl<boolean | null>(null, Validators.required),

    });
    this.HFormGroup2 = this.fb.group({
      address: ["", Validators.required],
    });
    
    this.VFormGroup1 = this.fb.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
    });
    this.VFormGroup2 = this.fb.group({
      address: ["", Validators.required],
    });
    this.stationId = this.route.snapshot.paramMap.get('stationId');
    if(this.stationId != null){
      this.HFormGroup1FormControl['startStationId'].setValue(parseInt(this.stationId));
    }
  }
  
  get HFormGroup1FormControl(){
    return this.HFormGroup1.controls;
  }

  getTripById(tripId: string){
    this.tripsService.getById(tripId).subscribe(res => {
      this.trip = res.result;
      this.getStations();
      //console.log(this.trip);
    })
  }

  getStations(){
    this.stationsService.getAllActive().subscribe(res => {
      this.stations = res.result;
      if(this.trip.routeName == 'Beirut-Tripoli'){
        this.stations.reverse();
      }
    })
  }

  getTicketPrice(){
    if(this.HFormGroup1?.invalid){
      return;
    }
    let model : any = {
      startStationId: this.HFormGroup1FormControl['startStationId'].value,
      endStationId: this.HFormGroup1FormControl['endStationId'].value,
      routeName: this.trip.routeName
    }
    this.ticketsService.getTicketPrice(model).subscribe(res => {
      if(res.success){
        this.price=res.result;        
        this.foundPrice = true;
      }
      else{
        this.foundPrice = false;
        this.showNotification(
          "snackbar-danger",
          res.message,
          "bottom",
          "center"
        );
      }
    })
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, "", {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }

  availableSeat(){
    if(this.statusStanding!=null){
      this.SeatsService.availableSeat(parseInt(this.tripId), this.statusStanding).subscribe(res => {
        if(res.success){
          this.isSeatAvailable = true;
          this.seatId = res.result;
          this.showNotification(
            "snackbar-success",
            res.message,
            "bottom",
            "center"
          );
        }
        else{
          this.isSeatAvailable = false;
          this.seatId = 0;
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

  Submit(){
    if(this.HFormGroup1?.invalid){
      return;
    }

    if(!this.foundPrice){
      this.showNotification(
        "snackbar-danger",
        "Price not found, please select stations correctly",
        "bottom",
        "center"
      );
    }

    if(!this.isSeatAvailable){
      this.showNotification(
        "snackbar-danger",
        "Seat not available, please change your selections",
        "bottom",
        "center"
      );
    }

    let body: Ticket = {
      id: 0,
      busId: this.trip.busId,
      userId: this.user.id,
      routeId: this.trip.routeId,
      tripId: this.trip.Id,
      price: this.price,
      seatId: this.seatId,
      isActive: true
    }
    this.ticketsService.create(body).subscribe(res=>{
      if(res.success){
        this.router.navigate(['schedules/purchased-tickets']);
        this.showNotification(
          "snackbar-success",
          res.message,
          "bottom",
          "center"
        );
      }
      else{
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
