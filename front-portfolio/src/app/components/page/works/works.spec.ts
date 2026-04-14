import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Works } from './works';

describe('Works', () => {
  let component: Works;
  let fixture: ComponentFixture<Works>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Works]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Works);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
