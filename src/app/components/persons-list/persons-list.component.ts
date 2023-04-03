import { Component, OnInit } from '@angular/core';
import { Person } from 'src/app/models/person.model';
import { PersonsService } from 'src/app/services/persons.service';

@Component({
  selector: 'app-persons-list',
  templateUrl: './persons-list.component.html',
  styleUrls: ['./persons-list.component.css']
})
export class PersonsListComponent implements OnInit {

  searchText = '';
  persons: Person[] = [];


  constructor(private personsService: PersonsService) { }

  ngOnInit(): void {
    this.personsService.getAllPersons()
      .subscribe({
        next: (persons) => {
          console.log(persons);
          this.persons = persons;
        },
        error: (response) => {
          console.log("error");
          console.log(response);
        }
      });
  }


}
