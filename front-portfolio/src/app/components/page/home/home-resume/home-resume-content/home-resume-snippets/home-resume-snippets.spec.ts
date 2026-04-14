import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeResumeSnippets } from './home-resume-snippets';

describe('HomeResumeSnippets', () => {
  let component: HomeResumeSnippets;
  let fixture: ComponentFixture<HomeResumeSnippets>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeResumeSnippets]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeResumeSnippets);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
