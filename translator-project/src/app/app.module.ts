import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EditWordComponent } from './components/edit-word/edit-word.component';
import { ListWordsComponent } from './components/list-words/list-words.component';
import { LoginUserComponent } from './components/login-user/login-user.component';
import { RegistrationUserComponent } from './components/registration-user/registration-user.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    EditWordComponent,
    ListWordsComponent,
    LoginUserComponent,
    RegistrationUserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
