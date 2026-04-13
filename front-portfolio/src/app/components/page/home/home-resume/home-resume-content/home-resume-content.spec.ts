import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeResumeContent } from './home-resume-content';

describe('HomeResumeContent', () => {
  let component: HomeResumeContent;
  let fixture: ComponentFixture<HomeResumeContent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeResumeContent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeResumeContent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
