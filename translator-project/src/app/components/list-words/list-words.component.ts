import { Component, ElementRef, ViewChild } from '@angular/core';
import { WordsService } from '../../words.service';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-list-words',
  templateUrl: './list-words.component.html',
  styleUrl: './list-words.component.css',
})
export class ListWordsComponent {
  constructor(private word:WordsService, private http:HttpClient) {  }
  @ViewChild('buttonGroup') buttonGroup!: ElementRef;
  @ViewChild('mymodal') mymodal!: ElementRef;
  addWord = new FormGroup({
    word: new FormControl( '' ),
    translate: new FormControl( '' ),
    study_priority: new FormControl( '' ),
    id_user: new FormControl(localStorage.getItem('userId'))
  }); 
  inputText:string = '';
  translatedText = '';
  wordData:any[] = [];
  alert:string = '';
  userId:string = localStorage.getItem('userId') || '';
  userHasWords: boolean = false;

  ngOnInit(): void {
    this.filterWords('Now');
  }

  filterWords(state:string){
    this.word.getFilteredWords(state).subscribe(words => {
      this.wordData = words.map(item => ({ ...item, isFlipped: false }));
      this.userHasWords = this.wordData.some(item => item.id_user === localStorage.getItem('userId'));
    });
  }

  toggleCard(index: number): void {
    this.wordData[index].isFlipped = !this.wordData[index].isFlipped;
  }
  
  deleteWord( word_id:any ){
    this.word.deleteWord(word_id).subscribe((result)=>{
      window.location.reload();
    });
  }

  //Add Word Module
  CheckData():number {
    if (!this.addWord.value.word || !this.addWord.value.study_priority) {
      this.alert = 'Please fill in all fields.';
      return 1;
    }
    const wordRegex = /^[\p{L}\s]*$/u; 
    if (!wordRegex.test(this.addWord.value.word)) {
        this.alert = 'Please enter only letters in the word field.';
        return 1;
    }
    this.alert = '';
    return 0;
  }

  SaveData(){
  this.word.saveWordData(this.addWord.value).subscribe((result) => {
      this.addWord.reset({ id_user: localStorage.getItem('userId') });
      window.location.reload();
  });
  }

  closeAlert() {
    this.alert = ''; 
  }
  
  getCardClass(priority: string): string {
    switch (priority) {
      case 'The most important':
        return 'bg-danger';
      case 'Importantly':
        return 'bg-primary';
      case 'Neutral':
        return 'bg-info';
      case 'For later':
        return 'bg-black';
      case 'Already':
        return 'bg-black';
      default:
        return 'bg-info';
    }
  }

  closeButtons() {
    this.buttonGroup.nativeElement.style.display = 'none';
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

  openModal() {
    const modalElement = this.mymodal.nativeElement;
    modalElement.classList.add('show');
    modalElement.style.display = 'block';
  }
  
  closeModal() {
    const modalElement = this.mymodal.nativeElement;
    this.addWord.reset({ id_user: localStorage.getItem('userId') });
    modalElement.classList.remove('show');
    modalElement.style.display = 'none';
  }
}
