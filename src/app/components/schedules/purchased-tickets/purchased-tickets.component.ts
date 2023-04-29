import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PurchasedTicketsDataSource } from './datasource';
import { Filter } from 'src/app/shared/models/filter';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, tap } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { TicketsService } from '../../tickets/services/tickets.service';

@Component({
  selector: 'app-purchased-tickets',
  templateUrl: './purchased-tickets.component.html',
  styleUrls: ['./purchased-tickets.component.sass']
})

export class PurchasedTicketsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    "routeName",
    "busName",
    "seatNumber",
    "price",
    "date"
  ];
  dataSource!: PurchasedTicketsDataSource;
  filter: Filter = {
    quickSearch: null,
  };
  userId!:string;
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild("filterInput") filterInput!: ElementRef;

  constructor(private authService: AuthService, private ticketsService : TicketsService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.user?.id;
    this.dataSource = new PurchasedTicketsDataSource(this.ticketsService);
    this.dataSource.getPurchasedTickets(this.filter, "date", "asc", 0, 10, this.userId);
  }

  ngAfterViewInit() {
    merge(this.sort?.sortChange, this.paginator?.page)
      .pipe(tap(() => this.loadPuchasedTickets()))
      .subscribe();
  }

  loadPuchasedTickets() {
    // reset the paginator after sorting
    this.sort?.sortChange.subscribe(() => (this.paginator!.pageIndex = 0));
    this.dataSource.getPurchasedTickets(
      this.filter,
      this.sort?.active,
      this.sort?.direction,
      this.paginator?.pageIndex,
      this.paginator?.pageSize,
      this.userId
    );
  }

  doQuickSearch() {
    this.filter.quickSearch = this.filterInput.nativeElement.value;
    this.loadPuchasedTickets();
  }

  clearQuickSearch() {
    this.filter.quickSearch = null;
    this.filterInput.nativeElement.value = "";
    this.loadPuchasedTickets();
  }

}
