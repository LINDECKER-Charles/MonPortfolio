import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MobiusRibbon } from '../mobius-ribbon/mobius-ribbon';

@Component({
  selector: 'app-scene-graph',
  standalone: true,
  imports: [MobiusRibbon],
  templateUrl: './scene-graph.html',
  styleUrl: './scene-graph.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SceneGraph {}
