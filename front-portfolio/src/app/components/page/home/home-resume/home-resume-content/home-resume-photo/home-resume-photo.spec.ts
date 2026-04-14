import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeResumePhoto } from './home-resume-photo';

describe('HomeResumePhoto', () => {
  let component: HomeResumePhoto;
  let fixture: ComponentFixture<HomeResumePhoto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeResumePhoto]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeResumePhoto);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
