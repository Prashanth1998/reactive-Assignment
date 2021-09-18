import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SurveyData } from '../survey';
import { SurveyDataService } from '../survey-data.service';


@Component({

  templateUrl: './house-details.component.html',
  styleUrls: ['./house-details.component.css']
})
export class HouseDetailsComponent implements OnInit {

  pageTitle = 'House details ';
  errorMessage = '';
  surveyData: SurveyData | undefined;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private surveyDataService: SurveyDataService) { }

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get('id');
    if (param) {
      const id = +param;
      this.getMember(id);
    }

  }
  getMember(id: number): void {
    this.surveyDataService.getMember(id).subscribe({
      next: surveyData => this.surveyData = surveyData,
      error: err => this.errorMessage = err

    });
  }
  onBack(): void {
    this.router.navigate(['']);
  }

}
