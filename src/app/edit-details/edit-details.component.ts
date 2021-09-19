import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators, FormArray, FormArrayName, FormControl } from '@angular/forms';
import { EditDetails } from '../edit-details';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { SurveyData } from '../survey';
import { SurveyDataService } from '../survey-data.service';
import { Data } from '../survey-data';
import { Member } from '../member';
import { formatCurrency } from '@angular/common';
import { GenericValidator } from '../generic-validators';

function noOfPeopleValidator(min: number): ValidatorFn {
  return (c: AbstractControl): { [key: string]: boolean } | null => {
    if (c.value !== null && (isNaN(c.value) || c.value < 1)) {
      return { 'noOfPeople': true };
    }
    return null;
  };
}
@Component({

  templateUrl: './edit-details.component.html',
  styleUrls: ['./edit-details.component.css']
})
export class EditDetailsComponent implements OnInit, OnDestroy {


  pageTitle = 'Address Edit';
  errorMessage: string;
  private genericValidator: GenericValidator;


  editDetailsForm: FormGroup;
  // editDetails: Data = new Data();

  surveyData: SurveyData;
  private sub: Subscription;
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };


  editDetails: EditDetails = new EditDetails();
  get members(): FormArray {
    return <FormArray>this.editDetailsForm.get('members');
  }

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
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
        required: 'at least 1 member required'
      }
    };

    // Define an instance of the validator for use with this form,
    // passing in this form's set of validation messages.
    this.genericValidator = new GenericValidator(this.validationMessages);
  }


  ngOnInit(): void {
    this.editDetailsForm = this.fb.group({
      id: [''],
      line1: ['', [Validators.required]],
      line2: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(40)]],
      noOfPeople: ['1', noOfPeopleValidator(1)],
      members: this.fb.array([])
    });

    this.sub = this.route.paramMap.subscribe(
      params => {
        const id = +params.get('id');
        this.getMember(id);
      }
    );
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  getMember(id: number): void {
    this.surveyDataService.getMember(id).subscribe({
      next: (surveyData: SurveyData) => this.displayMember(surveyData),
      error: err => this.errorMessage = err
    });
  }

  displayMember(surveyData: SurveyData): void {
    if (this.editDetailsForm) {
      this.editDetailsForm.reset();
    }
    this.surveyData = surveyData;

    if (surveyData.id === 0) {
      this.pageTitle = 'add address';
    }
    else {
      this.pageTitle = `edit Member: ${surveyData.members}`;
    }
    this.editDetailsForm.patchValue({
      id: surveyData.id,
      line1: surveyData.line1,
      line2: surveyData.line2

    });
    this.editDetailsForm.setControl('members', this.memberDetails(surveyData.members));
  }

  memberDetails(member: Member[]): FormArray {
    const array = new FormArray([]);
    member.forEach(m => {
      array.push(
        this.fb.group(
          {
            name: m.name,
            gender: m.gender,
            age: m.age
          }
        )
      )
    });
    return array;

  }

  addMember(): void {
    this.members.push(new FormControl());
  }
  deleteHouse(): void {
    console.log(this.surveyData);
    if (this.surveyData.id === 0) {
      // Don't delete, it was never saved.
      this.onSaveComplete();
    } else {
      if (confirm(`Really delete the Member: ${this.surveyData.line1}?`)) {
        this.surveyDataService.deleteHouse(this.surveyData.id)
          .subscribe({
            next: () => this.onSaveComplete(),
            error: err => this.errorMessage = err
          });
      }
    }
  }


  saveMember(): void {
    if (this.editDetailsForm.valid) {
      if (this.editDetailsForm.dirty) {
        const p = { ...this.surveyData, ...this.editDetailsForm.value };

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
    this.editDetailsForm.reset();
    this.router.navigate(['']);
  }
  deleteMember(): void {

  }




}
