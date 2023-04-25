import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { finalize, fromEvent, merge, tap } from 'rxjs';
import { Filter } from 'src/app/shared/models/filter';
import { BusTypeComponent } from '../bus-type/bus-type.component';
import { BusType } from '../models/busType';
import { BusTypesService } from '../services/bus-types.service';
import { BusTypesDataSource } from './datasource';

@Component({
  selector: "app-bus-types",
  templateUrl: "./bus-types.component.html",
  styleUrls: ["./bus-types.component.sass"],
})
export class BusTypesComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    "name",
    "standingSeats",
    "seatedSeats",
    "totalSeats",
    "actions",
    "active",
  ];
  dataSource!: BusTypesDataSource;
  filter: Filter = {
    quickSearch: null,
  };
  activate: boolean = false;
  public inputfilterRef!: ElementRef;
  busType : BusType = {
    id: null,
    name : null,
    seatedSeats : null,
    standingSeats : null,
    isActive : null,
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild("filterInput") filterInput!: ElementRef;

  constructor(
    private busTypesService: BusTypesService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.dataSource = new BusTypesDataSource(this.busTypesService);
    this.dataSource.getBusTypes(this.filter, "name", "asc", 0, 10);
  }

  ngAfterViewInit() {
    merge(this.sort?.sortChange, this.paginator?.page)
      .pipe(tap(() => this.loadBusTypes()))
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

  loadBusTypes() {
    // reset the paginator after sorting
    this.sort?.sortChange.subscribe(() => (this.paginator!.pageIndex = 0));
    this.dataSource.getBusTypes(
      this.filter,
      this.sort?.active,
      this.sort?.direction,
      this.paginator?.pageIndex,
      this.paginator?.pageSize
    );
  }

  doQuickSearch() {
    this.filter.quickSearch = this.filterInput.nativeElement.value;
    this.loadBusTypes();
  }

  clearQuickSearch() {
    this.filter.quickSearch = null;
    this.filterInput.nativeElement.value = "";
    this.loadBusTypes();
  }

  activateBusType(busType: BusType) {
    this.activate = true;
    busType.isActive = !busType.isActive;
    this.busTypesService
      .activate(busType)
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
          this.loadBusTypes();
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
    this.busType = {
      id: null,
      name : null,
      seatedSeats : null,
      standingSeats : null,
      isActive : null,
    };
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(BusTypeComponent, {
      data: {
        advanceTable: this.busType,
        action: 'add'
      },
      direction: tempDirection
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadBusTypes();
    })
  }

  edit(row: any) {
    this.busTypesService.getById(row.id).subscribe(res => {
      if(res.success){
        this.busType = res.result;
        const dialogRef = this.dialog.open(BusTypeComponent, {
          data: {
            advanceTable: this.busType,
            action: 'edit'
          },
          //direction: tempDirection
        });
    
        dialogRef.afterClosed().subscribe(() => {
          this.loadBusTypes();
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
