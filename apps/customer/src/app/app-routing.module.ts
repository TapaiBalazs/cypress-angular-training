import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PizzaListComponent } from './components/pizza-list/pizza-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'pizza', pathMatch: 'full' },
  { path: 'pizza', component: PizzaListComponent },
  { path: '**', redirectTo: 'pizza' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
