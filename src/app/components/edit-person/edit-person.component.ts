import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Person } from 'src/app/models/person.model';
import { PersonsService } from 'src/app/services/persons.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-edit-person',
  templateUrl: './edit-person.component.html',
  styleUrls: ['./edit-person.component.css']
})
export class EditPersonComponent implements OnInit {

  submitted = false;
  personDetails: Person;
  myForm: FormGroup;

  @ViewChildren('phoneInputs') phoneInputs!: QueryList<ElementRef>;

  constructor(private route: ActivatedRoute, private service: PersonsService, private router: Router) {
    this.myForm = new FormGroup({
      'firstName': new FormControl('', [Validators.required, Validators.pattern('^[a-zA-zЁёА-я]+'), Validators.maxLength(30)]),
      'lastName': new FormControl('', [Validators.pattern('^[a-zA-zЁёА-я]+'), Validators.maxLength(30)]),
      'birthYear': new FormControl(new Date().getFullYear(), Validators.maxLength(4)),
      'phones': new FormArray([])
    });
    this.personDetails = {
      personId: 0,
      firstName: '',
      lastName: '',
      birthYear: 0,
      phones: []
    };
  }



  getFormPhonesControls(): FormArray {
    return this.myForm.controls['phones'] as FormArray;
  }

  fromPersonToFormControls() {
    this.myForm.controls['firstName'].setValue(this.personDetails.firstName);
    this.myForm.controls['lastName'].setValue(this.personDetails.lastName);
    this.myForm.controls['birthYear'].setValue(this.personDetails.birthYear);
    this.personDetails.phones?.forEach((phone) => {
      (<FormArray>this.myForm.controls["phones"]).push(new FormControl(phone.phoneNumber, [Validators.required, Validators.pattern("[0-9]{10}")]));
    })
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (params) => {
        const id = params.get('id');
        if (id) {
          this.service.getPerson(parseInt(id))
            .subscribe({
              next: (response) => {
                this.personDetails = response;
                this.fromPersonToFormControls();
              }
            });
        }
      }
    });
  }

  addPhone() {
    this.phoneInputs.changes.pipe(take(1)).subscribe({
      next: changes => changes.last.nativeElement.focus()
    });

    (<FormArray>this.myForm.controls["phones"]).push(new FormControl("", [Validators.required, Validators.pattern("[0-9]{10}")]));
    this.personDetails.phones.push({
      id: 0,
      personId: 0,
      phoneNumber: ''
    });
  }

  deletePhone(index: number) {
    (<FormArray>this.myForm.controls["phones"]).removeAt(index);
    this.personDetails.phones.splice(index, 1);
    console.log("New Phones: " + this.personDetails.phones);
  }

  isAnyPhoneControlEmpty(): boolean {
    this.getFormPhonesControls()['controls'].forEach((phone) => {
      if (phone.value == '')
        return false;
      else return true;
    })
    return false;
  }

  getValuesFromForm() {
    this.personDetails.firstName = this.myForm.controls['firstName'].value;
    this.personDetails.lastName = this.myForm.controls['lastName'].value;
    this.personDetails.birthYear = this.myForm.controls['birthYear'].value;
    this.getFormPhonesControls()['controls'].forEach((phone, index) => {
      this.personDetails.phones[index].phoneNumber = phone.value;
    })
    console.log(this.personDetails);
  }


  updatePerson() {
    this.submitted = true;
    this.getValuesFromForm();
    this.service.updatePerson(this.personDetails)
      .subscribe({
        next: () => {
          this.router.navigate(['persons'])
        }
      });
  }

  deletePerson() {
    this.service.deletePerson(this.personDetails.personId)
      .subscribe({
        next: () => {
          this.router.navigate(['persons'])
        }
      });
  }

}
