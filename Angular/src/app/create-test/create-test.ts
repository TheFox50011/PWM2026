import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FooterComponent } from '../components/footer/footer';
import { HeaderComponent } from '../components/header/header';
import { AsideComponent } from '../components/sidebar/sidebar';

export interface Option {
  text: string;
  isCorrect: boolean;
}

export interface Question {
  questionText: string;
  options: Option[];
}

export interface Test {
  test_id: string;
  title: string;
  questions: Question[];
  created_at: string;
}

@Component({
  selector: 'app-create-test',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent, AsideComponent],
  template: `
    <app-header></app-header>

    <div class="layout-container">
      <app-sidebar></app-sidebar>

      <main class="main-content">
        <h1 class="page-title">Create Test</h1>

        <div class="test-form-wrapper">

          <div class="left-column">
            <label class="input-label">Test name</label>
            <input type="text" [(ngModel)]="testName" class="input-title" placeholder="Enter test name…">

            <div class="question-card">
              <label class="card-label">Question {{ currentQuestionIndex + 1 }}</label>
              <input type="text"
                     [(ngModel)]="questions[currentQuestionIndex].questionText"
                     class="input-pill"
                     placeholder="Write your question here…">

              <label class="card-label" style="margin-top:10px">
                Options &nbsp;<span style="font-size:11px;font-weight:400;color:#7a9eae">— click ○ to mark correct answer</span>
              </label>

              <div class="option-row" *ngFor="let opt of questions[currentQuestionIndex].options; let i = index">
                <button class="correct-btn" [class.is-correct]="opt.isCorrect" (click)="toggleCorrect(i)">
                  {{ opt.isCorrect ? '✓' : '○' }}
                </button>
                <input type="text" [(ngModel)]="opt.text" class="input-pill" [placeholder]="'Option ' + letters[i]">
                <button class="remove-option-btn"
                        *ngIf="questions[currentQuestionIndex].options.length > 2"
                        (click)="removeOption(i)">✕</button>
              </div>

              <div class="add-text-btn" (click)="addOption()">
                <strong>+</strong> Add option
              </div>
            </div>
          </div>

          <div class="right-column">
            <div class="options-card">
              <label class="card-label">Questions</label>

              <div class="question-item"
                   *ngFor="let q of questions; let idx = index"
                   (click)="selectQuestion(idx)"
                   [class.active-q]="idx === currentQuestionIndex">
                <span>Question {{ idx + 1 }}</span>
                <button class="remove-question-btn"
                        *ngIf="questions.length > 1"
                        (click)="removeQuestion(idx, $event)">✕</button>
              </div>

              <div class="sidebar-add-btn" (click)="addQuestion()">
                <span>Add question</span>
                <strong>+</strong>
              </div>
            </div>

            <button class="create-btn" (click)="createTest()">Create Test</button>
          </div>

        </div>
      </main>
    </div>

    <app-footer></app-footer>
  `,
  styleUrls: ['./create-test.css']
})
export class CreateTest {
  testName: string = '';
  letters = ['A','B','C','D','E','F'];

  questions: Question[] = [
    {
      questionText: '',
      options: [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
      ]
    }
  ];

  currentQuestionIndex: number = 0;

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
    const q = this.questions[this.currentQuestionIndex];
    q.options.forEach((o, idx) => o.isCorrect = idx === i);
  }

  addQuestion() {
    this.questions.push({
      questionText: '',
      options: [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
      ]
    });
    this.currentQuestionIndex = this.questions.length - 1;
  }

  removeQuestion(i: number, e: Event) {
    e.stopPropagation();
    if (this.questions.length <= 1) return;
    this.questions.splice(i, 1);
    if (this.currentQuestionIndex >= this.questions.length)
      this.currentQuestionIndex = this.questions.length - 1;
  }

  selectQuestion(i: number) {
    this.currentQuestionIndex = i;
  }

  createTest() {
    if (!this.testName.trim()) { alert('Give your test a name.'); return; }

    for (let i = 0; i < this.questions.length; i++) {
      const q = this.questions[i];
      if (!q.questionText.trim()) { alert('Question ' + (i+1) + ' has no text.'); return; }
      if (q.options.filter(o => o.text.trim()).length < 2) { alert('Question ' + (i+1) + ' needs at least 2 options.'); return; }
      if (!q.options.some(o => o.isCorrect)) { alert('Question ' + (i+1) + ' needs a correct answer marked.'); return; }
    }

    const test: Test = {
      test_id: 'test_' + Date.now(),
      title: this.testName.trim(),
      questions: this.questions,
      created_at: new Date().toISOString()
    };

    const all: Test[] = JSON.parse(localStorage.getItem('availableTests') || '[]');
    all.push(test);
    localStorage.setItem('availableTests', JSON.stringify(all));

    alert('Test "' + test.title + '" created!');
    this.router.navigate(['/mainpage']);
  }
}
