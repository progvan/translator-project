import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WordsService {
  url = 'http://localhost:3000/words';
  url_users = 'http://localhost:3000/users';
  constructor(private http: HttpClient) { }

  getAllWords(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }

  saveWordData(data: any): Observable<any> {
    return this.getAllWords().pipe(
      map(words => {
        return { ...data, id: 
          (words.reduce((acc, word) => Math.max(acc, parseInt(word.id, 10)), 0) + 1).toString() };
      }),
      switchMap(newWord => this.http.post(this.url, newWord))
    );
  }

  deleteWord( id:number) {
    return this.http.delete(`${this.url}/${id}`);
  }

  getWordById(id:number) {
    return this.http.get(`${this.url}/${id}`);
  }

  updateWordDate(id:number, data:any){
    return this.http.put(`${this.url}/${id}`, data);
  }

  //User
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.url_users);
  }

  saveUserData(data: any): Observable<any> {
    const { repeat_password, ...userData } = data;
    return this.getAllUsers().pipe(
      map(users => {
        return { ...userData, id: (users.reduce((acc, user) => Math.max(acc, parseInt(user.id, 10)), 0) + 1).toString() };
      }),
      switchMap(newUser => this.http.post(this.url_users, newUser))
    );
  }

  getFilteredWords(state:string): Observable<any[]> {
    return this.http.get<any[]>(this.url).pipe(
      map(words => words.filter(word => {
        if(state === 'For later') return word.study_priority === state;
        else if(state === 'Already') return word.study_priority === state;
        else return word.study_priority !== 'For later' && word.study_priority !== 'Already'
      }))
    );
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.url_users}/${id}`);
  }

  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.url_users}/${id}`);
  }

  getUserByNickname(nickname: string): Observable<any> {
    return this.http.get<any[]>(`${this.url_users}?nickname=${nickname}`).pipe(
      map(users => users.length ? users[0] : null) 
    );
  }

  checkWordExistence(word: string, userId: string): Observable<boolean> {
    return this.getAllWords().pipe(
      map(words => words.some(item => item.word === word && item.id_user === userId))
    );
}

}
