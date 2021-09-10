import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, AbstractControl, ValidatorFn, FormBuilder } from '@angular/forms';
import { Survey } from '../survey';


function noOfPeopleValidator(min: number): ValidatorFn {
  return (c: AbstractControl): { [key: string]: boolean } | null => {
    if (c.value !== null && (isNaN(c.value) || c.value < 1)) {
      return { 'noOfPeople': true };
    }
    return null;
  };
}


@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit {

  surveyForm: FormGroup;
  survey: Survey = new Survey();
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.surveyForm = this.fb.group({
      line1: ['', [Validators.required, Validators.minLength(5)]],
      line2: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(40)]],
      noOfPeople: ['1', noOfPeopleValidator(1)],

      house: ''
    })

  }


  save(): void {
    console.log(this.surveyForm);
    console.log('Saved: ' + JSON.stringify(this.surveyForm.value));
  }

}
