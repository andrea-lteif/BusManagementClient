import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TicketsDataSource } from './datasource';
import { Filter } from 'src/app/shared/models/filter';
import { Ticket } from '../models/ticket';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TicketsService } from '../services/tickets.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize, merge, tap } from 'rxjs';
import { TicketComponent } from '../ticket/ticket.component';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.sass']
})

export class TicketsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    "routeName",
    "busName",
    "seatNumber",
    "price",
    "userName",
    "actions",
    "active",
  ];
  dataSource!: TicketsDataSource;
  filter: Filter = {
    quickSearch: null,
  };
  activate: boolean = false;
  public inputfilterRef!: ElementRef;
  ticket : Ticket = {
    id: null,
    busId : null,
    routeId:null,
    userId:null,
    tripId:null,
    seatId:null,
    isActive : null,
    price: null
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild("filterInput") filterInput!: ElementRef;

  constructor(
    private ticketsService: TicketsService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.dataSource = new TicketsDataSource(this.ticketsService);
    this.dataSource.getTickets(this.filter, "id", "asc", 0, 10);
  }

  ngAfterViewInit() {
    merge(this.sort?.sortChange, this.paginator?.page)
      .pipe(tap(() => this.loadTickets()))
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

  loadTickets() {
    // reset the paginator after sorting
    this.sort?.sortChange.subscribe(() => (this.paginator!.pageIndex = 0));
    this.dataSource.getTickets(
      this.filter,
      this.sort?.active,
      this.sort?.direction,
      this.paginator?.pageIndex,
      this.paginator?.pageSize
    );
  }

  doQuickSearch() {
    this.filter.quickSearch = this.filterInput.nativeElement.value;
    this.loadTickets();
  }

  clearQuickSearch() {
    this.filter.quickSearch = null;
    this.filterInput.nativeElement.value = "";
    this.loadTickets();
  }

  activateTicket(ticket: Ticket) {
    this.activate = true;
    ticket.isActive = !ticket.isActive;
    this.ticketsService
      .activate(ticket)
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
          this.loadTickets();
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
    this.ticket = {
      id: null,
    busId : null,
    routeId:null,
    userId:null,
    seatId:null,
    tripId:null,
    price:null,
    isActive : null,
    };
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(TicketComponent, {
      data: {
        advanceTable: this.ticket,
        action: 'add'
      },
      direction: tempDirection
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadTickets();
    })
  }

  edit(row: any) {
    this.ticketsService.getById(row.id).subscribe(res => {
      if(res.success){
        this.ticket = res.result;
        const dialogRef = this.dialog.open(TicketComponent, {
          data: {
            advanceTable: this.ticket,
            action: 'edit'
          },
          //direction: tempDirection
        });
    
        dialogRef.afterClosed().subscribe(() => {
          this.loadTickets();
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

