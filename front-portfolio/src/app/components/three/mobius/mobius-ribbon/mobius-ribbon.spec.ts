import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobiusRibbon } from './mobius-ribbon';

describe('MobiusRibbon', () => {
  let component: MobiusRibbon;
  let fixture: ComponentFixture<MobiusRibbon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobiusRibbon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobiusRibbon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
