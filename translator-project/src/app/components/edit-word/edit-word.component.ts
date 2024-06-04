import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { WordsService } from '../../words.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-edit-word',
  templateUrl: './edit-word.component.html',
  styleUrl: './edit-word.component.css'
})
export class EditWordComponent implements OnInit {
  @ViewChild('buttonGroup') buttonGroup!: ElementRef;

  constructor(private word:WordsService, private activated_router:ActivatedRoute, private router:Router, private http:HttpClient) {  }
  
  editWord = new FormGroup({
    word: new FormControl( '' ),
    translate: new FormControl( '' ),
    study_priority: new FormControl( '' ),
    id_user: new FormControl( '' )
  }); 
  alert:string = '';
  inputText:string = '';
  translatedText:string = '';
  userId:string = localStorage.getItem('userId') || '';

  ngOnInit(): void {
    this.word.getWordById(this.activated_router.snapshot.params.id).subscribe((result:any) => {
      this.editWord = new FormGroup({
        word: new FormControl( result['word'] ),
        translate: new FormControl( result['translate'] ),
        study_priority: new FormControl( result['study_priority'] ),
        id_user: new FormControl( localStorage.getItem('userId') )
      }); 
    });
  }

  UpdateData(){
    this.word.updateWordDate(this.activated_router.snapshot.params.id, this.editWord.value).
    subscribe((result:any) => {
      this.router.navigate(['/']);
    });
  }

  CheckData():number {
    if (!this.editWord.value.word || !this.editWord.value.study_priority) {
      this.alert = 'Please fill in all fields.';
      return 1;
    }
    const wordRegex = /^[\p{L}\s]*$/u; 
    if (!wordRegex.test(this.editWord.value.word)) {
        this.alert = 'Please enter only letters in the word field.';
        return 1;
    }
    this.alert = '';
    return 0;
  }


  translate() {
    if (this.CheckData()) {
        this.buttonGroup.nativeElement.style.display = 'none';
        return;
    }

    const word = this.inputText.trim(); 

    this.word.checkWordExistence(word, this.userId).subscribe(exists => {
      if (exists) {
            this.buttonGroup.nativeElement.style.display = 'none';
            this.alert = 'The word already exists in the list.';
            return;
        } else {
            this.http.post("https://translation.googleapis.com/language/translate/v2?key=AIzaSyDQzIP-4SzjhlCStN_hrblrust_bc7nWxA", {
                "q": [word],
                "target": "en"
            }).subscribe((result: any) => {
                this.translatedText = result.data.translations[0].translatedText;
                this.buttonGroup.nativeElement.style.display = 'flex';
            });
        }
    });
}

  closeAlert() {
    this.alert = ''; 
  }

  closeButtons() {
    this.buttonGroup.nativeElement.style.display = 'none';
  }
}
