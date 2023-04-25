import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, catchError, finalize, Observable, of } from "rxjs";
import { DataTableRequest } from "src/app/shared/models/dataTableRequest";
import { Filter } from "src/app/shared/models/filter";
import { PaymentsService } from "../services/payments.service";

export class PaymentsDataSource implements DataSource<any> 
{
    private paymentsSubject = new BehaviorSubject<any[]>([]);
    private paymentsTotalRecordsSubject = new BehaviorSubject<number>(0);
    private loadingSubject = new BehaviorSubject<boolean>(false);
   
    constructor(private paymentsService: PaymentsService) {}

    get payments$()
    {
        return this.paymentsSubject.value;
    }

    get loading$()
    {
        return this.loadingSubject.value;
    }

    get totalRecords$()
    {
        return this.paymentsTotalRecordsSubject.value;
    }

    connect(collectionViewer: CollectionViewer): Observable<any[]> 
    {
        return this.paymentsSubject.asObservable();
    }
  
    disconnect(collectionViewer: CollectionViewer): void 
    {
        this.paymentsSubject.complete();
        this.loadingSubject.complete();
        this.paymentsTotalRecordsSubject.complete();
    }

    getPayments(filter : Filter, sortColumn : string, sortDirection: string, pageIndex: number, pageSize: number) 
    {
        this.loadingSubject.next(true);
        let datatableRequest : DataTableRequest = {
            pageIndex : pageIndex,
            pageSize : pageSize,
            sortCol : sortColumn,
            sortDirection : sortDirection,
            tableFilter : filter
        };
       
        this.paymentsService.getAllSSR(datatableRequest)
        .pipe(catchError(() => of([])), finalize(() => this.loadingSubject.next(false)))
        .subscribe(resp => {
            this.paymentsTotalRecordsSubject.next(resp.result.totalRecord);
            this.paymentsSubject.next(resp.result.data);
        });
        

    }  

}