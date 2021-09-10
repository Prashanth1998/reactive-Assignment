import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators, FormArray } from '@angular/forms';
import { EditDetails } from '../edit-details';

function noOfPeopleValidator(min: number): ValidatorFn {
  return (c: AbstractControl): { [key: string]: boolean } | null => {
    if (c.value !== null && (isNaN(c.value) || c.value < 1)) {
      return { 'noOfPeople': true };
    }
    return null;
  };
}
@Component({
  selector: 'app-edit-details',
  templateUrl: './edit-details.component.html',
  styleUrls: ['./edit-details.component.css']
})
export class EditDetailsComponent implements OnInit {
  editDetailsForm: FormGroup;
  editDetails: EditDetails = new EditDetails();


  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.editDetailsForm = this.fb.group({
      line1: ['', [Validators.required, Validators.minLength(5)]],
      line2: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(40)]],
      noOfPeople: ['1', noOfPeopleValidator(1)],
      members: this.fb.array([])
    })
  }

}
