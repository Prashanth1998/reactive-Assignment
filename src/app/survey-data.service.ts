import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { from, Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { SurveyData } from './survey';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SurveyDataService {
  apiUrl = "api/surveyData";
  idFromUrl: any;

  constructor(private http: HttpClient, private router: ActivatedRoute) { }

  getMembers(): Observable<SurveyData[]> {
    return this.http.get<SurveyData[]>(this.apiUrl).pipe
      (tap(data => console.log(data)),
        catchError(this.handleError)
      );
  }
  getMember(id: number): Observable<SurveyData> {
    if (id === 0) {
      return of(this.initialzeMember());
    }
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<SurveyData>(url).pipe(
      tap(data => console.log(data)),
      catchError(this.handleError)
    );
  }


  createMember(surveyData: SurveyData): Observable<SurveyData> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    surveyData.id = null;
    return this.http.post<SurveyData>(this.apiUrl, surveyData, { headers })
      .pipe(
        tap(data => console.log('createProduct: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  deleteProduct(id: number): Observable<{}> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<SurveyData>(url, { headers })
      .pipe(
        tap(data => console.log('deleteProduct: ' + id)),
        catchError(this.handleError)
      );
  }




  updateMember(surveyData: SurveyData): Observable<SurveyData> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.apiUrl}/${surveyData.id}`;
    return this.http.put<SurveyData>(url, surveyData, { headers })
      .pipe(
        tap(() => console.log('updateProduct: ' + surveyData.id)),
        // Return the product on an update
        map(() => surveyData),
        catchError(this.handleError)
      );
  }

  private handleError(err): Observable<never> {

    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {

      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }

  private initialzeMember(): SurveyData {
    return {
      id: 0,
      line1: null,
      line2: null,
      members: []

    };
  }

}

