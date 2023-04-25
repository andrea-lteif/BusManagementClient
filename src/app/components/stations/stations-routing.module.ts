import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StationsComponent } from './stations/stations.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { HasRoleGuard } from 'src/app/core/guards/has-role.guard';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'stations',
        component: StationsComponent,
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
export class StationsRoutingModule { }
