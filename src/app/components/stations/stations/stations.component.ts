import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { finalize, fromEvent, merge, tap } from 'rxjs';
import { Filter } from 'src/app/shared/models/filter';
import { Station } from '../models/station';
import { StationsService } from '../services/stations.service';
import { StationComponent } from '../station/station.component';
import { StationsDataSource } from './datasource';
@Component({
  selector: 'app-stations',
  templateUrl: './stations.component.html',
  styleUrls: ['./stations.component.sass']
})

export class StationsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    "name",
    "orderNumber",
    "duration",
    "stopTime",
    "price",
    "location",
    "actions",
    "active",
  ];
  dataSource!: StationsDataSource;
  filter: Filter = {
    quickSearch: null,
  };
  activate: boolean = false;
  public inputfilterRef!: ElementRef;
  station : Station = {
    id: null,
    name : null,
    location:null,
    orderNumber:null,
    stopTime:null,
    duration : null,
    price : null,
    isActive : null,
    routeId: null
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild("filterInput") filterInput!: ElementRef;

  constructor(
    private stationsService: StationsService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.dataSource = new StationsDataSource(this.stationsService);
    this.dataSource.getStations(this.filter, "orderNumber", "asc", 0, 10);
  }

  ngAfterViewInit() {
    merge(this.sort?.sortChange, this.paginator?.page)
      .pipe(tap(() => this.loadStations()))
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

  loadStations() {
    // reset the paginator after sorting
    this.sort?.sortChange.subscribe(() => (this.paginator!.pageIndex = 0));
    this.dataSource.getStations(
      this.filter,
      this.sort?.active,
      this.sort?.direction,
      this.paginator?.pageIndex,
      this.paginator?.pageSize
    );
  }

  doQuickSearch() {
    this.filter.quickSearch = this.filterInput.nativeElement.value;
    this.loadStations();
  }

  clearQuickSearch() {
    this.filter.quickSearch = null;
    this.filterInput.nativeElement.value = "";
    this.loadStations();
  }

  activateStation(station: Station) {
    this.activate = true;
    station.isActive = !station.isActive;
    this.stationsService
      .activate(station)
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
          this.loadStations();
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
    this.station = {
      id: null,
      name: null,
      location: null,
      orderNumber: null,
      stopTime: null,
      duration: null,
      price: null,
      isActive: null,
      routeId: null
    };
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(StationComponent, {
      data: {
        advanceTable: this.station,
        action: 'add'
      },
      direction: tempDirection
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadStations();
    })
  }

  edit(row: any) {
    this.stationsService.getById(row.id).subscribe(res => {
      if(res.success){
        this.station = res.result;
        const dialogRef = this.dialog.open(StationComponent, {
          data: {
            advanceTable: this.station,
            action: 'edit'
          },
          //direction: tempDirection
        });
    
        dialogRef.afterClosed().subscribe(() => {
          this.loadStations();
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
