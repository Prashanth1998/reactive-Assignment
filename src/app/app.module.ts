import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { AppComponent } from './app.component';
import { SurveyComponent } from './survey/survey.component';
import { AddHouseComponent } from './add-house/add-house.component';
import { HouseDetailsComponent } from './house-details/house-details.component';
import { EditDetailsComponent } from './edit-details/edit-details.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Data } from './survey-data';


@NgModule({
  declarations: [
    AppComponent,
    SurveyComponent,
    AddHouseComponent,
    HouseDetailsComponent,
    EditDetailsComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    InMemoryWebApiModule.forRoot(Data),
    RouterModule.forRoot([
      { path: '', component: SurveyComponent },
      { path: 'survey/:id', component: HouseDetailsComponent },
      { path: 'edit/:id', component: EditDetailsComponent },
      { path: 'add', component: AddHouseComponent }

    ])
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
function SurveyData(SurveyData: any): any[] | import("@angular/core").Type<any> | import("@angular/core").ModuleWithProviders<{}> {
  throw new Error('Function not implemented.');
}

