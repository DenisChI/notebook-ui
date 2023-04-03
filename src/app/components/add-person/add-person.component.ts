import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { Person } from 'src/app/models/person.model';
import { PersonsService } from 'src/app/services/persons.service';
import { FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { take } from 'rxjs';


@Component({
  selector: 'app-add-person',
  templateUrl: './add-person.component.html',
  styleUrls: ['./add-person.component.css']
})
export class AddPersonComponent implements OnInit {

  @ViewChildren('phoneInputs') phoneInputs!: QueryList<ElementRef>;

  newPerson: Person;
  myForm: FormGroup;
  submitted = false;

  constructor(private service: PersonsService, private router: Router) {
    this.myForm = new FormGroup({
      'firstName': new FormControl('', [Validators.required, Validators.pattern('^[a-zA-zЁёА-я]+'), Validators.maxLength(30)]),
      'lastName': new FormControl('', [Validators.pattern('^[a-zA-zЁёА-я]+'), Validators.maxLength(30)]),
      'birthYear': new FormControl(new Date().getFullYear(), Validators.maxLength(4)),
      'phones': new FormArray([])
    });

    this.newPerson = {
      personId: 0,
      firstName: '',
      lastName: '',
      birthYear: 0,
      phones: []
    };
  }


  ngOnInit(): void { }

  getFormPhonesControls(): FormArray {
    return this.myForm.controls['phones'] as FormArray;
  }

  addPhone() {
    this.phoneInputs.changes.pipe(take(1)).subscribe({
      next: changes => changes.last.nativeElement.focus()
    });

    (<FormArray>this.myForm.controls["phones"]).push(new FormControl("", [Validators.required, Validators.pattern("[0-9]{10}")]));
    this.newPerson.phones.push({
      id: 0,
      personId: 0,
      phoneNumber: ''
    });
  }

  deletePhone(index: number) {
    (<FormArray>this.myForm.controls["phones"]).removeAt(index);
    this.newPerson.phones.splice(index, 1);
  }

  getValuesFromForm() {
    this.newPerson.firstName = this.myForm.controls['firstName'].value;
    this.newPerson.lastName = this.myForm.controls['lastName'].value;
    this.newPerson.birthYear = this.myForm.controls['birthYear'].value;
    this.getFormPhonesControls()['controls'].forEach((phone, index) => {
      this.newPerson.phones[index].phoneNumber = phone.value;
    })
    console.log(this.newPerson);
  }

  addPerson() {
    this.submitted = true;
    this.getValuesFromForm();
    this.service.addPerson(this.newPerson)
      .subscribe({
        next: (person) => {
          console.log(person);
          this.router.navigate(['persons'])
        }
      });
  }

}
