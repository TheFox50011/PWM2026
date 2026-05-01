import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../components/footer/footer';
import { HeaderComponent } from '../components/header/header';
import { ActivatedRoute, Router } from '@angular/router';
import { Question } from '../create-test/create-test';   // ← adjust path if needed

@Component({
  selector: 'app-do-test',
  standalone: true,
  imports: [CommonModule, FooterComponent, HeaderComponent],
  templateUrl: './do-test.html',
  styleUrl: './do-test.css',
})
export class DoTest implements OnInit {
  testId: string | null = null;
  testData: any = null;

  currentIndex: number = 0;
  userAnswers: (number | null)[] = [];  // index of selected option per question
  finished: boolean = false;
  score: number = 0;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.testId = this.route.snapshot.paramMap.get('id');
    this.loadTest();
  }

  // ── Load ──────────────────────────────────────────────────────────────────
  loadTest() {
    const tests = JSON.parse(localStorage.getItem('availableTests') || '[]');
    this.testData = tests.find(
      (t: any) => (t.test_id || t.id).toString() === this.testId
    ) || null;

    if (this.testData) {
      this.userAnswers = new Array(this.testData.questions.length).fill(null);
    }
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  optionLetter(i: number): string {
    return String.fromCharCode(65 + i);   // A, B, C, D…
  }

  answeredCount(): number {
    return this.userAnswers.filter(a => a !== null).length;
  }

  isCorrect(questionIndex: number): boolean {
    const answer = this.userAnswers[questionIndex];
    if (answer === null || !this.testData) return false;
    return this.testData.questions[questionIndex].options[answer]?.isCorrect === true;
  }

  correctText(q: any): string {
    return q.options.find((o: any) => o.isCorrect)?.text || '—';
  }

  // ── Navigation ────────────────────────────────────────────────────────────
  selectAnswer(optionIndex: number) {
    this.userAnswers[this.currentIndex] = optionIndex;
  }

  next() {
    if (this.testData && this.currentIndex < this.testData.questions.length - 1) {
      this.currentIndex++;
    }
  }

  prev() {
    if (this.currentIndex > 0) this.currentIndex--;
  }

  goTo(index: number) {
    this.currentIndex = index;
  }

  // ── Finish ────────────────────────────────────────────────────────────────
  finish() {
    const unanswered = this.userAnswers.filter(a => a === null).length;
    if (unanswered > 0) {
      const proceed = confirm(
        `You have ${unanswered} unanswered question(s). Finish anyway?`
      );
      if (!proceed) return;
    }

    // Calculate score
    this.score = this.testData.questions.reduce((acc: number, q: any, i: number) => {
      return acc + (this.isCorrect(i) ? 1 : 0);
    }, 0);

    this.finished = true;
  }

  // ── Restart ───────────────────────────────────────────────────────────────
  restart() {
    this.currentIndex = 0;
    this.userAnswers = new Array(this.testData.questions.length).fill(null);
    this.finished = false;
    this.score = 0;
  }

  goHome() {
    this.router.navigate(['/mainpage']);   // adjust if your route is different
  }
}
