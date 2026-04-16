import { Component, ChangeDetectionStrategy } from '@angular/core';

/**
 * Particules d'ember — petits points chauds qui remontent lentement, comme
 * des cendres au-dessus d'un foyer. Ambiance Bloodborne immédiate pour un
 * coût perf dérisoire (12 spans, animations CSS GPU-only).
 *
 * Le composant est purement visuel et se positionne en absolute à l'échelle
 * de son parent — à placer dans `<app-root>` à côté des autres couches de fond.
 */
@Component({
  selector: 'app-ember-particles',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ember-particles" aria-hidden="true">
      @for (_ of particles; track $index) {
        <span class="ember-particle"></span>
      }
    </div>
  `,
  styleUrl: './ember-particles.css',
})
export class EmberParticles {
  /** 12 particules — suffisant pour l'ambiance, imperceptible en charge. */
  protected readonly particles = Array.from({ length: 12 });
}
