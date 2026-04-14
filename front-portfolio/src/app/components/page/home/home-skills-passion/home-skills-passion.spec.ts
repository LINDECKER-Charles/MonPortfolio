import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeSkillsPassion } from './home-skills-passion';

describe('HomeSkillsPassion', () => {
  let component: HomeSkillsPassion;
  let fixture: ComponentFixture<HomeSkillsPassion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeSkillsPassion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeSkillsPassion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
