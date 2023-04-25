import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TripsDataSource } from './datasource';
import { Filter } from 'src/app/shared/models/filter';
import { Trip } from '../models/trip';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TripsService } from '../services/trips.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize, merge, tap } from 'rxjs';
import { TripComponent } from '../trip/trip.component';

@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.sass']
})

export class TripsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    "routeName",
    "busName",
    "startTime",
    "active",
  ];
  dataSource!: TripsDataSource;
  filter: Filter = {
    quickSearch: null,
  };
  activate: boolean = false;
  public inputfilterRef!: ElementRef;
  trip : Trip = {
    id: null,
    busId : null,
    routeId:null,
    startTime:null,
    endTime:null,
    isActive : null,
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild("filterInput") filterInput!: ElementRef;

  constructor(
    private tripsService: TripsService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.dataSource = new TripsDataSource(this.tripsService);
    this.dataSource.getTrips(this.filter, "id", "asc", 0, 10);
  }

  ngAfterViewInit() {
    merge(this.sort?.sortChange, this.paginator?.page)
      .pipe(tap(() => this.loadTrips()))
      .subscribe();
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, "", {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }

  loadTrips() {
    // reset the paginator after sorting
    this.sort?.sortChange.subscribe(() => (this.paginator!.pageIndex = 0));
    this.dataSource.getTrips(
      this.filter,
      this.sort?.active,
      this.sort?.direction,
      this.paginator?.pageIndex,
      this.paginator?.pageSize
    );
  }

  doQuickSearch() {
    this.filter.quickSearch = this.filterInput.nativeElement.value;
    this.loadTrips();
  }

  clearQuickSearch() {
    this.filter.quickSearch = null;
    this.filterInput.nativeElement.value = "";
    this.loadTrips();
  }

  activateStation(trip: Trip) {
    this.activate = true;
    trip.isActive = !trip.isActive;
    this.tripsService
      .activate(trip)
      .pipe(finalize(() => (this.activate = false)))
      .subscribe((resp) => {
        if (resp.success) {
          this.activate = true;
          this.showNotification(
            "snackbar-success",
            resp.message,
            "bottom",
            "center"
          );
          this.loadTrips();
        } else {
          this.showNotification(
            "snackbar-danger",
            resp.message,
            "bottom",
            "center"
          );
        }
      });
  }

  addNew() {
    let tempDirection;
    this.trip = {
      id: null,
      routeId: null,
      busId: null,
      startTime: null,
      endTime:null,
      isActive: null
    };
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(TripComponent, {
      data: {
        advanceTable: this.trip,
        action: 'add'
      },
      direction: tempDirection
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadTrips();
    })
  }

  edit(row: any) {
    this.tripsService.getById(row.id).subscribe(res => {
      if(res.success){
        this.trip = res.result;
        const dialogRef = this.dialog.open(TripComponent, {
          data: {
            advanceTable: this.trip,
            action: 'edit'
          },
          //direction: tempDirection
        });
    
        dialogRef.afterClosed().subscribe(() => {
          this.loadTrips();
        })
      }else{
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

