import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FooterComponent } from '../components/footer/footer';
import { HeaderComponent } from '../components/header/header';
import { AsideComponent } from '../components/sidebar/sidebar';
import { Auth } from '@angular/fire/auth';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

export interface Option { text: string; isCorrect: boolean; }
export interface Question { questionText: string; options: Option[]; }
export interface Test {
  title: string;
  questions: Question[];
  created_at: string;
  author_id: string | null;
}

@Component({
  selector: 'app-create-test',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent, AsideComponent],
  templateUrl: './create-test.html',
  styleUrls: ['./create-test.css']
})
export class CreateTest {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  testName: string = '';
  letters = ['A','B','C','D','E','F'];
  currentQuestionIndex: number = 0;
  questions: Question[] = [{ questionText: '', options: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }] }];

  constructor(private router: Router) {}

  addOption() {
    const q = this.questions[this.currentQuestionIndex];
    if (q.options.length >= 6) { alert('Maximum 6 options.'); return; }
    q.options.push({ text: '', isCorrect: false });
  }

  removeOption(i: number) {
    const q = this.questions[this.currentQuestionIndex];
    if (q.options.length > 2) q.options.splice(i, 1);
  }

  toggleCorrect(i: number) {
    this.questions[this.currentQuestionIndex].options.forEach((o, idx) => o.isCorrect = idx === i);
  }

  addQuestion() {
    this.questions.push({ questionText: '', options: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }] });
    this.currentQuestionIndex = this.questions.length - 1;
  }

  removeQuestion(i: number, e: Event) {
    e.stopPropagation();
    if (this.questions.length <= 1) return;
    this.questions.splice(i, 1);
    if (this.currentQuestionIndex >= this.questions.length) this.currentQuestionIndex = this.questions.length - 1;
  }

  selectQuestion(i: number) { this.currentQuestionIndex = i; }

  async createTest() {
    if (!this.testName.trim()) { alert('Give your test a name.'); return; }
    for (let i = 0; i < this.questions.length; i++) {
      const q = this.questions[i];
      if (!q.questionText.trim()) { alert('Question ' + (i+1) + ' has no text.'); return; }
      if (q.options.filter(o => o.text.trim()).length < 2) { alert('Question ' + (i+1) + ' needs at least 2 options.'); return; }
      if (!q.options.some(o => o.isCorrect)) { alert('Question ' + (i+1) + ' needs a correct answer marked.'); return; }
    }

    const currentUser = this.auth.currentUser;
    const test: Test = {
      title: this.testName.trim(),
      questions: this.questions,
      created_at: new Date().toISOString(),
      author_id: currentUser?.uid || null
    };

    await addDoc(collection(this.firestore, 'tests'), test);
    alert('Test "' + test.title + '" created!');
    this.router.navigate(['/mainpage']);
  }

  protected optionPlaceholder(i: number): string {
    return `Option ${this.letters[i] || i + 1}`;
  }

  protected isQuestionComplete(idx: number): boolean {
    const q = this.questions[idx];
    return (
      q.questionText.trim() !== '' &&
      q.options.filter(o => o.text.trim()).length >= 2 &&
      q.options.some(o => o.isCorrect)
    );
  }
}
