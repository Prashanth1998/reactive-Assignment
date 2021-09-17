import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators, FormArray } from '@angular/forms';
import { EditDetails } from '../edit-details';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { SurveyData } from '../survey';
import { SurveyDataService } from '../survey-data.service';
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
  selector: 'app-edit-details',
  templateUrl: './edit-details.component.html',
  styleUrls: ['./edit-details.component.css']
})
export class EditDetailsComponent implements OnInit, OnDestroy {


  pageTitle = 'Address Edit';
  errorMessage: string;


  editDetailsForm: FormGroup;
  // editDetails: Data = new Data();

  surveyData: SurveyData;
  private sub: Subscription;

  editDetails: EditDetails = new EditDetails();
  get members(): FormArray {
    return <FormArray>this.editDetailsForm.get('members');
  }

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private surveyDataService: SurveyDataService) { }

  ngOnInit(): void {
    this.editDetailsForm = this.fb.group({
      line1: ['', [Validators.required, Validators.minLength(5)]],
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

    if (this.surveyData.id === 0) {
      this.pageTitle = 'add address';
    }
    else {
      this.pageTitle = `edit Member: ${this.surveyData.members}`;
    }
    this.editDetailsForm.patchValue({
      line1: this.surveyData.line1,
      line2: this.surveyData.line2,
      members: this.surveyData.members

    });
    this.editDetailsForm.setControl('members', this.fb.array(this.surveyData.members || []));
  }

  deleteMember(): void {
    if (this.surveyData.id === 0) {
      // Don't delete, it was never saved.
      this.onSaveComplete();
    } else {
      if (confirm(`Really delete the product: ${this.surveyData.line1}?`)) {
        this.surveyDataService.deleteProduct(this.surveyData.id)
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
    this.router.navigate(['/survey']);
  }





}
