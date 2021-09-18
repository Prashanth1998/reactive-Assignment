import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators, FormArray } from '@angular/forms';
// import { AddHouse } from '../add-house';
import { Data } from '../survey-data';
import { GenericValidator } from '../generic-validators';
import { ActivatedRoute, Router } from '@angular/router';
import { SurveyDataService } from '../survey-data.service';
import { SurveyData } from '../survey';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';

function noOfPeopleValidator(min: number): ValidatorFn {
  return (c: AbstractControl): { [key: string]: boolean } | null => {
    if (c.value !== null && (isNaN(c.value) || c.value < 1)) {
      return { 'noOfPeople': true };
    }
    return null;
  };
}


@Component({

  templateUrl: './add-house.component.html',
  styleUrls: ['./add-house.component.css']
})

export class AddHouseComponent implements OnInit {
  addHouseForm: FormGroup;
  // addHouse: Data = new Data();
  surveyData: SurveyData;

  errorMessage: string;
  displayMessage: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } };

  private genericValidator: GenericValidator;

  get members(): FormArray {
    return <FormArray>this.addHouseForm.get('members');
  }



  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router,
    private surveyDataService: SurveyDataService) {

    this.validationMessages = {
      line1: {
        required: 'address line 1 is required.',

      },
      line2: {
        required: 'address line 2 is required.',
        minlength: 'address line 2 must be at least 5 characters.',
        maxlength: 'address line 2 cannot exceed 40 characters.'
      },
      noOfPeople: {
        required: 'at least 1 member'
      },
      name: {
        required: 'name is required.',
        minlength: ' name must be at least 3 characters.',
        maxlength: ' name cannot exceed 32 characters.'


      },
      gender: {
        required: 'select gender'
      },
      age: {
        required: 'enter age greater than 0'
      }
    };

    // Define an instance of the validator for use with this form,
    // passing in this form's set of validation messages.
    this.genericValidator = new GenericValidator(this.validationMessages);
  }


  ngOnInit(): void {
    this.addHouseForm = this.fb.group({
      id: [''],
      line1: ['', [Validators.required]],
      line2: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(40)]],
      noOfPeople: ['1', noOfPeopleValidator(1)],

      members: this.fb.array([this.addMembers()])
    })

  }



  saveMember(): void {
    if (this.addHouseForm.valid) {
      if (this.addHouseForm.dirty) {
        const p = { ...this.surveyData, ...this.addHouseForm.value };


        if (p.id === 0) {
          this.surveyDataService.createMember(p)
            .subscribe({
              next: () => this.onSaveComplete(),
              error: err => this.errorMessage = err
            });
        } else {
          this.surveyDataService.updateMember(p)
            .subscribe({
              next: () => this.onSaveComplete(),
              error: err => this.errorMessage = err
            });
        }
      } else {
        this.onSaveComplete();
      }
    } else {
      this.errorMessage = 'Please correct the validation errors.';
    }
  }

  onSaveComplete(): void {
    // Reset the form to clear the flags
    this.addHouseForm.reset();
    this.router.navigate(['']);
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
