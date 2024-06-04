import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { WordsService } from '../../words.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration-user',
  templateUrl: './registration-user.component.html',
  styleUrl: './registration-user.component.css'
})
export class RegistrationUserComponent {
  constructor (private user:WordsService, private router:Router) {};

  addUser = new FormGroup({
    nickname: new FormControl(''),
    password: new FormControl(''),
    repeatPassword: new FormControl('')
  });

  alert: string = '';
  userData: any[] = [];
  userId: number | null = null;

  ngOnInit(): void {
    this.user.getAllUsers().subscribe((allData) => {
      this.userData = allData;
    });
    
  }

  deleteUser(userId: number) {
    this.user.deleteUser(userId).subscribe(() => {
      this.ngOnInit();
    });
  }

  SaveUserData() {
    const { nickname, password, repeatPassword } = this.addUser.value;

    if (!nickname || !password || !repeatPassword) {
      this.alert = 'Fill in all fields';
      return;
    }

    if (password !== repeatPassword) {
      this.alert = 'Passwords do not match.';
      return;
    }

    this.user.getUserByNickname(nickname).subscribe({
      next: (user) => {
        if (user && user.nickname === nickname) {
          this.alert = 'Nickname already exists';
        } else {
          this.user.saveUserData(this.addUser.value).subscribe(() => {
            this.addUser.reset({});
          });
          this.router.navigate(['/login']);
        }
      },
      error: (error) => {
        this.alert = 'Invalid nickname or password';
      }
    });
  }

  closeAlert() {
    this.alert = ''; 
  }
}
