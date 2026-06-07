import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Resum } from './resum';

describe('Resum', () => {
  let component: Resum;
  let fixture: ComponentFixture<Resum>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
      imports: [Resum]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Resum);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
