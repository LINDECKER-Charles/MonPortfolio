import { Component } from '@angular/core';
import { ResumActiveProjects } from './resum-active-projects/resum-active-projects';
import { ResumContactLinks } from './resum-contact-links/resum-contact-links';
import { ResumHeader } from './resum-header/resum-header';
import { ResumPassiveEffects } from './resum-passive-effects/resum-passive-effects';
import { ResumRuneIcons } from './resum-rune-icons/resum-rune-icons';
import { ResumStack } from './resum-stack/resum-stack';
import { ResumStats } from './resum-stats/resum-stats';
import {RESUM_IMAGES} from '../../../../imgSources/resum.sources';

@Component({
  selector: 'app-resum',
  imports: [
    ResumHeader,
    ResumStats,
    ResumStack,
    ResumRuneIcons,
    ResumPassiveEffects,
    ResumContactLinks,
    ResumActiveProjects,
  ],
  templateUrl: './resum.html',
  styleUrl: './resum.css',
})
export class Resum {
  public readonly images = RESUM_IMAGES;
}
