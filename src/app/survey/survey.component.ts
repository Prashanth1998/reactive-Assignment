import { Route } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, AbstractControl, ValidatorFn, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SurveyData } from '../survey';
import { Data } from '../survey-data';

import { SurveyDataService } from '../survey-data.service';

// this is homepage. 

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit {


  surveyData: SurveyData[] = [];
  member: any;
  constructor(private surveyDataService: SurveyDataService) {


  }


  ngOnInit(): void {
    this.surveyDataService.getMembers().subscribe(
      data => {
        this.surveyData = data;
        console.log(data);
      }

    )


  }




}
