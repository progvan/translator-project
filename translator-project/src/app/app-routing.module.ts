import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditWordComponent } from './components/edit-word/edit-word.component';
import { ListWordsComponent } from './components/list-words/list-words.component';
import { LoginUserComponent } from './components/login-user/login-user.component';
import { RegistrationUserComponent } from './components/registration-user/registration-user.component';

const routes: Routes = [
  {
      path: 'edit/:id',
      component: EditWordComponent
  },
  {
      path: '',
      component: ListWordsComponent
  },
  {
      path: 'login',
      component: LoginUserComponent
  },
  {
      path: 'registration',
      component: RegistrationUserComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
