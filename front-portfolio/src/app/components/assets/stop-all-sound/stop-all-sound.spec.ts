import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StopAllSound } from './stop-all-sound';

describe('StopAllSound', () => {
  let component: StopAllSound;
  let fixture: ComponentFixture<StopAllSound>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StopAllSound]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StopAllSound);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
