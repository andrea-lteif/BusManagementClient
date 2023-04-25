import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, catchError, finalize, Observable, of } from "rxjs";
import { DataTableRequest } from "src/app/shared/models/dataTableRequest";
import { Filter } from "src/app/shared/models/filter";
import { Ticket } from "../../tickets/models/ticket";
import { TicketsService } from "../../tickets/services/tickets.service";

export class PurchasedTicketsDataSource implements DataSource<Ticket> 
{
    private puchasedTicketsSubject = new BehaviorSubject<Ticket[]>([]);
    private purchasedTicketsTotalRecordsSubject = new BehaviorSubject<number>(0);
    private loadingSubject = new BehaviorSubject<boolean>(false);
   
    constructor(private ticketsService: TicketsService) {}

    get puchasedTickets$()
    {
        return this.puchasedTicketsSubject.value;
    }

    get loading$()
    {
        return this.loadingSubject.value;
    }

    get totalRecords$()
    {
        return this.purchasedTicketsTotalRecordsSubject.value;
    }

    connect(collectionViewer: CollectionViewer): Observable<Ticket[]> 
    {
        return this.puchasedTicketsSubject.asObservable();
    }
  
    disconnect(collectionViewer: CollectionViewer): void 
    {
        this.puchasedTicketsSubject.complete();
        this.loadingSubject.complete();
        this.purchasedTicketsTotalRecordsSubject.complete();
    }

    getPurchasedTickets(filter : Filter, sortColumn : string, sortDirection: string, pageIndex: number, pageSize: number, userId: string) 
    {
        this.loadingSubject.next(true);
        let datatableRequest : DataTableRequest = {
            pageIndex : pageIndex,
            pageSize : pageSize,
            sortCol : sortColumn,
            sortDirection : sortDirection,
            tableFilter : filter
        };
       
        this.ticketsService.getByUserId(datatableRequest, userId)
        .pipe(catchError(() => of([])), finalize(() => this.loadingSubject.next(false)))
        .subscribe(resp => {
            this.purchasedTicketsTotalRecordsSubject.next(resp.result.totalRecord);
            this.puchasedTicketsSubject.next(resp.result.data);
        });
        

    }  

}