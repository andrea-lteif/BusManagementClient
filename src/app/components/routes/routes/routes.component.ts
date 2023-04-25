import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { finalize, fromEvent, merge, tap } from 'rxjs';
import { Filter } from 'src/app/shared/models/filter';
import { Route } from '../models/route';
import { RouteComponent } from '../route/route.component';
import { RoutesService } from '../services/routes.service';
import { RoutesDataSource } from './datasource';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.sass']
})

export class RoutesComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    "name",
    "duration",
    "price",
    "actions",
    "active",
  ];
  dataSource!: RoutesDataSource;
  filter: Filter = {
    quickSearch: null,
  };
  activate: boolean = false;
  public inputfilterRef!: ElementRef;
  route : Route = {
    id: null,
    name : null,
    duration : null,
    price : null,
    isActive : null,
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild("filterInput") filterInput!: ElementRef;

  constructor(
    private routesService: RoutesService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.dataSource = new RoutesDataSource(this.routesService);
    this.dataSource.getRoutes(this.filter, "name", "asc", 0, 10);
  }

  ngAfterViewInit() {
    merge(this.sort?.sortChange, this.paginator?.page)
      .pipe(tap(() => this.loadRoutes()))
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

  loadRoutes() {
    // reset the paginator after sorting
    this.sort?.sortChange.subscribe(() => (this.paginator!.pageIndex = 0));
    this.dataSource.getRoutes(
      this.filter,
      this.sort?.active,
      this.sort?.direction,
      this.paginator?.pageIndex,
      this.paginator?.pageSize
    );
  }

  doQuickSearch() {
    this.filter.quickSearch = this.filterInput.nativeElement.value;
    this.loadRoutes();
  }

  clearQuickSearch() {
    this.filter.quickSearch = null;
    this.filterInput.nativeElement.value = "";
    this.loadRoutes();
  }

  activateRoute(route: Route) {
    this.activate = true;
    route.isActive = !route.isActive;
    this.routesService
      .activate(route)
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
          this.loadRoutes();
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
    this.route = {
      id: null,
      name : null,
      duration : null,
      price : null,
      isActive : null,
    };
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(RouteComponent, {
      data: {
        advanceTable: this.route,
        action: 'add'
      },
      direction: tempDirection
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadRoutes();
    })
  }

  edit(row: any) {
    this.routesService.getById(row.id).subscribe(res => {
      if(res.success){
        this.route = res.result;
        const dialogRef = this.dialog.open(RouteComponent, {
          data: {
            advanceTable: this.route,
            action: 'edit'
          },
          //direction: tempDirection
        });
    
        dialogRef.afterClosed().subscribe(() => {
          this.loadRoutes();
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
