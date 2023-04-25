import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { finalize, fromEvent, merge, tap } from 'rxjs';
import { Filter } from 'src/app/shared/models/filter';
import { BusComponent } from '../bus/bus.component';
import { Bus } from '../models/bus';
import { BusesService } from '../services/buses.service';
import { BusesDataSource } from './datasources';

@Component({
  selector: 'app-buses',
  templateUrl: './buses.component.html',
  styleUrls: ['./buses.component.sass']
})

export class BusesComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    "name",
    "typeName",
    "actions",
    "active",
  ];
  dataSource!: BusesDataSource;
  filter: Filter = {
    quickSearch: null,
  };
  activate: boolean = false;
  public inputfilterRef!: ElementRef;
  bus : Bus = {
    id: null,
    name : null,
    busTypeId : null,
    isActive : null,
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild("filterInput") filterInput!: ElementRef;

  constructor(
    private busesService: BusesService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.dataSource = new BusesDataSource(this.busesService);
    this.dataSource.getBuses(this.filter, "name", "asc", 0, 10);
  }

  ngAfterViewInit() {
    merge(this.sort?.sortChange, this.paginator?.page)
      .pipe(tap(() => this.loadBuses()))
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

  loadBuses() {
    // reset the paginator after sorting
    this.sort?.sortChange.subscribe(() => (this.paginator!.pageIndex = 0));
    this.dataSource.getBuses(
      this.filter,
      this.sort?.active,
      this.sort?.direction,
      this.paginator?.pageIndex,
      this.paginator?.pageSize
    );
  }

  doQuickSearch() {
    this.filter.quickSearch = this.filterInput.nativeElement.value;
    this.loadBuses();
  }

  clearQuickSearch() {
    this.filter.quickSearch = null;
    this.filterInput.nativeElement.value = "";
    this.loadBuses();
  }

  activateBus(bus: Bus) {
    this.activate = true;
    bus.isActive = !bus.isActive;
    this.busesService
      .activate(bus)
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
          this.loadBuses();
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
    const dialogRef = this.dialog.open(BusComponent, {
      data: {
        advanceTable: this.bus,
        action: 'add'
      },
      //direction: tempDirection
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadBuses();
    })
  }

  edit(row: any) {
    this.busesService.getById(row.id).subscribe(res => {
      if(res.success){
        this.bus = res.result;
        const dialogRef = this.dialog.open(BusComponent, {
          data: {
            advanceTable: this.bus,
            action: 'edit'
          },
          //direction: tempDirection
        });
    
        dialogRef.afterClosed().subscribe(() => {
          this.loadBuses();
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
