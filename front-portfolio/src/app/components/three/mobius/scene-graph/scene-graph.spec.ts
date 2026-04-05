import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SceneGraph } from './scene-graph';

describe('SceneGraph', () => {
  let component: SceneGraph;
  let fixture: ComponentFixture<SceneGraph>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SceneGraph]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SceneGraph);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
