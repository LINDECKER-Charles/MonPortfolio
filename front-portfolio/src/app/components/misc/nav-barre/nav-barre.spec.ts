import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavBarre } from './nav-barre';

describe('NavBarre', () => {
  let component: NavBarre;
  let fixture: ComponentFixture<NavBarre>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavBarre]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavBarre);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
