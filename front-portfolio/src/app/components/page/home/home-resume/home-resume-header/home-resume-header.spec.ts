import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeResumeHeader } from './home-resume-header';

describe('HomeResumeHeader', () => {
  let component: HomeResumeHeader;
  let fixture: ComponentFixture<HomeResumeHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeResumeHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeResumeHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
