import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTest } from './create-test';

describe('CreateTest', () => {
  let component: CreateTest;
  let fixture: ComponentFixture<CreateTest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateTest],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateTest);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

