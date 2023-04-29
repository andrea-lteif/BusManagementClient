import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { finalize, fromEvent, merge, tap } from 'rxjs';
import { Filter } from 'src/app/shared/models/filter';
import { Seat } from '../models/seat';
import { SeatComponent } from '../seat/seat.component';
import { SeatsService } from '../services/seats.service';
import { SeatsDataSource } from './datasource';
import { BusTypesService } from '../../bus-types/services/bus-types.service';

@Component({
  selector: 'app-seats',
  templateUrl: './seats.component.html',
  styleUrls: ['./seats.component.sass']
})

export class SeatsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    "number",
    "busTypeId",
    "statusStanding",
    "active",
  ];
  dataSource!: SeatsDataSource;
  filter: Filter = {
    quickSearch: null,
  };
  activate: boolean = false;
  public inputfilterRef!: ElementRef;
  seat : Seat = {
    id: null,
    number : null,
    busTypeId:null,
    statusStanding : null,
    isActive : null,
  };
  busTypes:any[]=[];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild("filterInput") filterInput!: ElementRef;

  constructor(
    private seatsService: SeatsService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private busTypesService : BusTypesService
  ) {}

  ngOnInit(): void {
    this.dataSource = new SeatsDataSource(this.seatsService);
    this.dataSource.getSeats(this.filter, "busTypeId", "asc", 0, 10);
    this.getBusTypes();
  }

  ngAfterViewInit() {
    merge(this.sort?.sortChange, this.paginator?.page)
      .pipe(tap(() => this.loadSeats()))
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

  loadSeats() {
    // reset the paginator after sorting
    this.sort?.sortChange.subscribe(() => (this.paginator!.pageIndex = 0));
    this.dataSource.getSeats(
      this.filter,
      this.sort?.active,
      this.sort?.direction,
      this.paginator?.pageIndex,
      this.paginator?.pageSize
    );
  }

  doQuickSearch() {
    this.filter.quickSearch = this.filterInput.nativeElement.value;
    this.loadSeats();
  }

  clearQuickSearch() {
    this.filter.quickSearch = null;
    this.filterInput.nativeElement.value = "";
    this.loadSeats();
  }

  activateSeat(seat: Seat) {
    this.activate = true;
    seat.isActive = !seat.isActive;
    this.seatsService
      .activate(seat)
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
          this.loadSeats();
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

  changeStatus(seat: any){
    seat.statusStanding = !seat.statusStanding;
    this.seatsService.changeStatus(seat).subscribe((resp) => {
      if(resp.success)
      {
        this.showNotification(
          "snackbar-success",
          resp.message,
          "bottom",
          "center"
        );        this.loadSeats();
      }
      else{
        this.showNotification(
          "snackbar-danger",
          resp.message,
          "bottom",
          "center"
        );      }
    })
  }

  addNew() {
    let tempDirection;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(SeatComponent, {
      data: {
        advanceTable: this.seat,
        action: 'add'
      },
      direction: tempDirection
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadSeats();
    })
  }

  edit(row: any) {
    this.seatsService.getById(row.id).subscribe(res => {
      if(res.success){
        this.seat = res.result;
        const dialogRef = this.dialog.open(SeatComponent, {
          data: {
            advanceTable: this.seat,
            action: 'edit'
          },
          //direction: tempDirection
        });
    
        dialogRef.afterClosed().subscribe(() => {
          this.loadSeats();
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

  getBusTypes(){
    this.busTypesService.getAllActive().subscribe(res => {
      this.busTypes = res.result;
      //this.filter.busTypeId = this.busTypes[0].id;
    })
  }
}
