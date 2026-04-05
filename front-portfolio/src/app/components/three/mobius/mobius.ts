import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgtCanvas, NgtCanvasContent } from 'angular-three/dom';
import { SceneGraph } from './scene-graph/scene-graph';

@Component({
  selector: 'app-mobius',
  standalone: true,
  imports: [NgtCanvas, NgtCanvasContent, SceneGraph],
  templateUrl: './mobius.html',
  styleUrl: './mobius.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Mobius {}
