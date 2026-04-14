import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeWork } from './home-work';

describe('HomeWork', () => {
  let component: HomeWork;
  let fixture: ComponentFixture<HomeWork>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeWork]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeWork);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
