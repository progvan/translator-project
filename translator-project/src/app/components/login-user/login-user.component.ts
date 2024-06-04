import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { WordsService } from '../../words.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-user',
  templateUrl: './login-user.component.html',
  styleUrl: './login-user.component.css'
})
export class LoginUserComponent {
  constructor (private user:WordsService, private router: Router) {};

  loginForm = new FormGroup({
    nickname: new FormControl(''),
    password: new FormControl('')
  });

  alert: string = '';
  userId: number | null = null;

  ngOnInit(): void {
    const storedUserId = localStorage.getItem('userId');
    this.userId = storedUserId ? parseInt(storedUserId, 10) : null;
  }

  login() {
    const { nickname, password } = this.loginForm.value;

    if (!nickname) {
      this.alert = 'Nickname is required';
      return;
    }

    this.user.getUserByNickname(nickname).subscribe({
      next: (user) => {
        if (user && user.password === password) {
          localStorage.setItem('userId', user.id);
          this.userId = user.id;
          this.router.navigate(['/']).then(() => {
            window.location.reload();
          });
        } else {
          this.alert = 'Invalid nickname or password';
        }
      }
    });    
  }

  closeAlert() {
    this.alert = ''; 
  }
}