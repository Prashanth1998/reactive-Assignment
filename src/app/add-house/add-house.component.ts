import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators, FormArray } from '@angular/forms';
// import { AddHouse } from '../add-house';
import { Data } from '../survey-data';


function noOfPeopleValidator(min: number): ValidatorFn {
  return (c: AbstractControl): { [key: string]: boolean } | null => {
    if (c.value !== null && (isNaN(c.value) || c.value < 1)) {
      return { 'noOfPeople': true };
    }
    return null;
  };
}


@Component({
  selector: 'app-add-house',
  templateUrl: './add-house.component.html',
  styleUrls: ['./add-house.component.css']
})

export class AddHouseComponent implements OnInit {
  addHouseForm: FormGroup;
  addHouse: Data = new Data();

  get members(): FormArray {
    return <FormArray>this.addHouseForm.get('members');
  }



  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.addHouseForm = this.fb.group({
      line1: ['', [Validators.required, Validators.minLength(5)]],
      line2: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(40)]],
      noOfPeople: ['1', noOfPeopleValidator(1)],

      members: this.fb.array([this.addMembers()])
    })

  }
  save(): void {
    console.log(this.addHouseForm);
    console.log('Saved: ' + JSON.stringify(this.addHouseForm.value));
  }
  addMember(): void {
    this.members.push(this.addMembers());
  }
  addMembers(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(32)]],
      gender: ['', Validators.required],
      age: ['', Validators.required],
    })
  }


}
