import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TripsComponent } from './trips/trips.component';
import { HasRoleGuard } from 'src/app/core/guards/has-role.guard';
import { AuthGuard } from 'src/app/core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'trips',
        component: TripsComponent,
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
export class TripsRoutingModule { }
