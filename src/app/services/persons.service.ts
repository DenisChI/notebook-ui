import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment'

import { Person } from '../models/person.model';

@Injectable({
  providedIn: 'root'
})
export class PersonsService {

  baseApiUrl = environment.baseApiUrl;

  constructor(private http: HttpClient) { }

  getAllPersons(): Observable<Person[]> {
    return this.http.get<Person[]>(this.baseApiUrl + '/persons');
  }

  addPerson(data: Person): Observable<Person> {
    return this.http.post<Person>(this.baseApiUrl + '/persons', data);
  }

  getPerson(id: number): Observable<Person> {
    return this.http.get<Person>(this.baseApiUrl + '/persons/' + id);
  }

  updatePerson(data: Person): Observable<Person> {
    return this.http.put<Person>(this.baseApiUrl + '/persons/' + data.personId.toString(), data);
  }

  deletePerson(id: number): Observable<Person> {
    return this.http.delete<Person>(this.baseApiUrl + '/persons/' + id);
  }
}
