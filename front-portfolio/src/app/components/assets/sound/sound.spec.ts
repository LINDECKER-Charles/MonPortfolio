import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sound } from './sound';

describe('Sound', () => {
  let component: Sound;
  let fixture: ComponentFixture<Sound>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sound]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sound);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
