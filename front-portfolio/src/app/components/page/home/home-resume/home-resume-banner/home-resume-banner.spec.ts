import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeResumeBanner } from './home-resume-banner';

describe('HomeResumeBanner', () => {
  let component: HomeResumeBanner;
  let fixture: ComponentFixture<HomeResumeBanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeResumeBanner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeResumeBanner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
