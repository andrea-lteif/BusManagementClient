import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, catchError, finalize, Observable, of } from "rxjs";
import { DataTableRequest } from "src/app/shared/models/dataTableRequest";
import { Filter } from "src/app/shared/models/filter";
import { Ticket } from "../models/ticket";
import { TicketsService } from "../services/tickets.service";

export class TicketsDataSource implements DataSource<Ticket> 
{
    private ticketsSubject = new BehaviorSubject<Ticket[]>([]);
    private ticketsTotalRecordsSubject = new BehaviorSubject<number>(0);
    private loadingSubject = new BehaviorSubject<boolean>(false);
   
    constructor(private ticketsService: TicketsService) {}

    get tickets$()
    {
        return this.ticketsSubject.value;
    }

    get loading$()
    {
        return this.loadingSubject.value;
    }

    get totalRecords$()
    {
        return this.ticketsTotalRecordsSubject.value;
    }

    connect(collectionViewer: CollectionViewer): Observable<Ticket[]> 
    {
        return this.ticketsSubject.asObservable();
    }
  
    disconnect(collectionViewer: CollectionViewer): void 
    {
        this.ticketsSubject.complete();
        this.loadingSubject.complete();
        this.ticketsTotalRecordsSubject.complete();
    }

    getTickets(filter : Filter, sortColumn : string, sortDirection: string, pageIndex: number, pageSize: number) 
    {
        this.loadingSubject.next(true);
        let datatableRequest : DataTableRequest = {
            pageIndex : pageIndex,
            pageSize : pageSize,
            sortCol : sortColumn,
            sortDirection : sortDirection,
            tableFilter : filter
        };
       
        this.ticketsService.getAllSSR(datatableRequest)
        .pipe(catchError(() => of([])), finalize(() => this.loadingSubject.next(false)))
        .subscribe(resp => {
            this.ticketsTotalRecordsSubject.next(resp.result.totalRecord);
            this.ticketsSubject.next(resp.result.data);
        });
        

    }  

}