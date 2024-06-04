import { Component, OnInit } from '@angular/core';
import { WordsService } from './words.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private service:WordsService) { }
  
  title = 'translator-project';
  userId:any = localStorage.getItem('userId');
  userNickname: string = '';

  ngOnInit(): void {
      this.service.getUserById(this.userId).subscribe(user => {
        this.userNickname = user.nickname;
    });
  }

  logout() {
    localStorage.removeItem('userId');
    this.userId = null;
    window.location.reload();
  }
}
