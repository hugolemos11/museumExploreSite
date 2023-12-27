import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SobreMuseusComponent } from './sobre-museus/sobre-museus.component';

const routes: Routes = [
  { path: 'sobreMuseu', component: SobreMuseusComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
