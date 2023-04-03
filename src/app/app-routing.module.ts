import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonsListComponent } from './components/persons-list/persons-list.component';
import { AddPersonComponent } from './components/add-person/add-person.component';
import { EditPersonComponent } from './components/edit-person/edit-person.component';

const routes: Routes = [
  {
    path: '',
    component: PersonsListComponent
  },
  {
    path: 'persons',
    component: PersonsListComponent
  },
  {
    path: 'persons/add',
    component: AddPersonComponent
  },
  {
    path: 'persons/edit/:id',
    component: EditPersonComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
