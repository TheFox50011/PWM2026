import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IndexComponent } from './index';
import { provideRouter } from '@angular/router';

describe('Index', () => {
  let component: IndexComponent;
  let fixture: ComponentFixture<IndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndexComponent],
      providers: [provideRouter([])] // Añadido para que routerLink no de error en el test
    }).compileComponents();

    fixture = TestBed.createComponent(IndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
