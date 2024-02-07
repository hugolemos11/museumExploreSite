import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TicketTypeComponent } from './ticket-type.component';

const routes: Routes = [{ path: '', component: TicketTypeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketTypeRoutingModule { }
