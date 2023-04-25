import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TripsService } from '../../trips/services/trips.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SchedulesDataSource } from './datasource';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { RoutesService } from '../../routes/services/routes.service';
import { finalize, merge, tap } from 'rxjs';
import { Router } from '@angular/router';
import { StationsService } from '../../stations/services/stations.service';

@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.sass']
})
export class SchedulesComponent implements OnInit{

  currentTrips!:any[];
  scheduleForm !: FormGroup;
  displayedColumns: string[] = [
    "routeName",
    "typeName",
    "busName",
    "startTime",
    "actions"
  ];
  dataSource!: SchedulesDataSource;
  filter: any = {
    routeId: null,
    date: null,
    startStationId:null
  };
  routes!:any;
  stations!:any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor(private tripsService : TripsService, private router: Router,
    private fb : FormBuilder, private routesService: RoutesService, private stationsService: StationsService){}

  ngOnInit(): void {
    this.scheduleForm = this.fb.group({
      date: new FormControl<Date | null>(null),
      routeId: new FormControl<number | null>(null),
      startStationId: new FormControl<number | null>(null)
    });
    this.displayedColumns = [
      "routeName",
      "typeName",
      "busName",
      "startTime",
      "actions"
    ];
    this.dataSource = new SchedulesDataSource(this.tripsService);
    this.dataSource.getSchedules(this.filter, "startTime", "asc", 0, 10);
   this.getCurrentTrips();
   this.getRoutes();
  }

  ngAfterViewInit() {
    merge(this.sort?.sortChange, this.paginator?.page)
      .pipe(tap(() => this.getSchedule()))
      .subscribe();
  }


  get scheduleFormControl(){
    return this.scheduleForm.controls;
  }

  ClearFilter(){
    this.filter.routeId = null;
    this.stations = [];
    this.filter.date = null;
    this.scheduleFormControl['routeId'].setValue(null);
    this.scheduleFormControl['date'].setValue(null);
    this.scheduleFormControl['startStationId'].setValue(null);
    this.getSchedule();
  }

  getSchedule(){
    this.filter = {
      routeId: this.scheduleFormControl['routeId'].value,
      date: this.scheduleFormControl['date'].value,
      startStationId: this.scheduleFormControl['startStationId'].value
    }
    if(this.filter.startStationId != null){
      this.displayedColumns = [
        "routeName",
        "typeName",
        "busName",
        "startTime",
        "stationName",
        "stationDepartureTime",
        "actions"
      ];
    }
    this.sort?.sortChange.subscribe(() => (this.paginator!.pageIndex = 0));
    this.dataSource.getSchedules(
      this.filter,
      this.sort?.active,
      this.sort?.direction,
      this.paginator?.pageIndex,
      this.paginator?.pageSize
    );
    this.getCurrentTrips();
  }

  getStations(){
    let routeId = this.scheduleFormControl['routeId'].value;
    this.stationsService.getByRouteId(routeId).subscribe(res=> {
      this.stations = res.result;
    })
  }

  purchase(row:any){
    if(this.scheduleFormControl['startStationId'].value != null){
      this.router.navigate(['/schedules/purchase-ticket',row.id, this.scheduleFormControl['startStationId'].value]);
    }else{
      this.router.navigate(['/schedules/purchase-ticket',row.id]);

    }
  }

  getCurrentTrips(){
    this.tripsService.getCurrentTrips().subscribe(res => {
      this.currentTrips = res.result;
    })
  }

  getRoutes(){
    this.routesService.getAllActive().subscribe(res => {
      this.routes = res.result
    })
  }
}
