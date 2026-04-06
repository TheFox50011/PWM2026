import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotYourPassword } from './forgot-your-password';

describe('ForgotYourPassword', () => {
  let component: ForgotYourPassword;
  let fixture: ComponentFixture<ForgotYourPassword>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgotYourPassword],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotYourPassword);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
