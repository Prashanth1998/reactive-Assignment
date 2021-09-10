import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { SurveyComponent } from './survey/survey.component';
import { AddHouseComponent } from './add-house/add-house.component';
import { HouseDetailsComponent } from './house-details/house-details.component';
import { EditDetailsComponent } from './edit-details/edit-details.component';
import { RouterModule } from '@angular/router';

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
    InMemoryWebApiModule.forRoot(SurveyData),
    RouterModule.forChild([
      { path: 'survey', component: SurveyComponent },
      { path: 'survey/:id', component: AddHouseComponent },
      { path: 'survey/:id/edit', component: EditDetailsComponent }
    ])
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
