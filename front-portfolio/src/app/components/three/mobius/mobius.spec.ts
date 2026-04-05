import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mobius } from './mobius';

describe('Mobius', () => {
  let component: Mobius;
  let fixture: ComponentFixture<Mobius>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mobius]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Mobius);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
