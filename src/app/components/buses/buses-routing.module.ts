import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusesComponent } from './buses/buses.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { HasRoleGuard } from 'src/app/core/guards/has-role.guard';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'buses',
        component: BusesComponent,
        canActivate: [AuthGuard, HasRoleGuard],
        data: {
          claim: 'Admin'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusesRoutingModule { }
