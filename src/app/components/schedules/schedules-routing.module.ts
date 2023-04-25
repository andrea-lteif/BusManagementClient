import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchedulesComponent } from './schedules/schedules.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { PurchasedTicketsComponent } from './purchased-tickets/purchased-tickets.component';
import { PurchaseTicketComponent } from './purchase-ticket/purchase-ticket.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'schedules',
        component: SchedulesComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'purchase-ticket/:id',
        component: PurchaseTicketComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'purchase-ticket/:id/:stationId',
        component: PurchaseTicketComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'purchased-tickets',
        component: PurchasedTicketsComponent,
        canActivate: [AuthGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchedulesRoutingModule { }
