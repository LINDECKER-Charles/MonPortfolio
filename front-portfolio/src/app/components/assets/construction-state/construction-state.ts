import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface ConstructionPillar {
  title: string;
  description: string;
  icon: 'roadmap' | 'craft' | 'launch';
}

@Component({
  selector: 'app-construction-state',
  imports: [CommonModule, RouterLink],
  templateUrl: './construction-state.html',
  styleUrl: './construction-state.css',
})
export class ConstructionState {
  protected readonly pillars: ConstructionPillar[] = [
    {
      title: 'Parcours en narration',
      description:
        'Je construis une lecture plus claire de mon evolution, avec les vraies etapes, les pivots et les projets qui comptent.',
      icon: 'roadmap',
    },
    {
      title: 'Presentation plus ambitieuse',
      description:
        'La page arrive avec une mise en scene plus forte, des interactions plus propres et un rendu mobile plus solide.',
      icon: 'craft',
    },
    {
      title: 'Mise en ligne prochaine',
      description:
        'La structure est en cours de finalisation. En attendant, tu peux continuer vers mes projets ou revenir a l accueil.',
      icon: 'launch',
    },
  ];
}
