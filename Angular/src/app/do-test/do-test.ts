import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef, Injector, runInInjectionContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent } from '@ionic/angular/standalone';
import { FooterComponent } from '../components/footer/footer';
import { HeaderComponent } from '../components/header/header';
import { ActivatedRoute, Router } from '@angular/router';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-do-test',
  standalone: true,
  imports: [CommonModule, IonContent, FooterComponent, HeaderComponent],
  templateUrl: './do-test.html',
  styleUrl: './do-test.css',
})
export class DoTest implements OnInit, OnDestroy {
  private firestore = inject(Firestore);
  private cdr = inject(ChangeDetectorRef);
  private injector = inject(Injector);
  private routeSub: Subscription | null = null;

  testId: string | null = null;
  testData: any = null;
  loading: boolean = true;

  currentIndex: number = 0;
  userAnswers: (number | null)[] = [];
  finished: boolean = false;
  score: number = 0;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.routeSub = this.route.paramMap.subscribe(params => {
      this.testId = params.get('id');

      this.currentIndex = 0;
      this.userAnswers = [];
      this.finished = false;
      this.score = 0;
      this.testData = null;
      this.loading = true;

      this.loadTest();
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    this.routeSub?.unsubscribe();
    this.cdr.detectChanges();
  }

  async loadTest() {
    if (!this.testId) { this.loading = false; return; }

    try {
      const snap = await runInInjectionContext(this.injector, () => {
        const testRef = doc(this.firestore, 'tests', this.testId!);
        return getDoc(testRef);
      });

      if (snap.exists()) {
        this.testData = { id: snap.id, ...snap.data() };
        this.userAnswers = new Array(this.testData.questions.length).fill(null);
      } else {
        this.testData = null;
      }
    } catch (e) {
      console.error('Error loading test:', e);
      this.testData = null;
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  optionLetter(i: number): string {
    return String.fromCharCode(65 + i);
    this.cdr.detectChanges();
  }

  answeredCount(): number {
    return this.userAnswers.filter(a => a !== null).length;
    this.cdr.detectChanges();
  }

  isCorrect(questionIndex: number): boolean {
    const answer = this.userAnswers[questionIndex];
    if (answer === null || !this.testData) return false;
    return this.testData.questions[questionIndex].options[answer]?.isCorrect === true;
    this.cdr.detectChanges();
  }

  correctText(q: any): string {
    return q.options.find((o: any) => o.isCorrect)?.text || '—';
    this.cdr.detectChanges();
  }

  // ── Navigation ────────────────────────────────────────────────────────────
  selectAnswer(optionIndex: number) {
    this.userAnswers[this.currentIndex] = optionIndex;
    this.cdr.detectChanges();
  }

  next() {
    if (this.testData && this.currentIndex < this.testData.questions.length - 1) {
      this.currentIndex++;
      this.cdr.detectChanges();
    }
  }

  prev() {
    if (this.currentIndex > 0) this.currentIndex--;
    this.cdr.detectChanges();
  }

  goTo(index: number) {
    this.currentIndex = index;
    this.cdr.detectChanges();
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

    this.score = this.testData.questions.reduce((acc: number, q: any, i: number) => {
      return acc + (this.isCorrect(i) ? 1 : 0);
    }, 0);

    this.finished = true;
    this.cdr.detectChanges();
  }

  // ── Restart ───────────────────────────────────────────────────────────────
  restart() {
    this.currentIndex = 0;
    this.userAnswers = new Array(this.testData.questions.length).fill(null);
    this.finished = false;
    this.score = 0;
    this.cdr.detectChanges();
  }

  goHome() {
    this.router.navigate(['/mainpage']);
    this.cdr.detectChanges();
  }
}
