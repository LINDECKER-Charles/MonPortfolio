import { Component, Input, inject } from '@angular/core';
import {
  PhotoCarousel,
  PhotoCarouselSlide,
} from '../../../../../assets/photo-carousel/photo-carousel';
import { TranslationService } from '../../../../../../services/translation.service';
import { TiltDirective } from '../../../../../../directives/tilt.directive';

@Component({
  selector: 'app-home-resume-photo',
  imports: [PhotoCarousel, TiltDirective],
  templateUrl: './home-resume-photo.html',
  styleUrl: './home-resume-photo.css',
})
export class HomeResumePhoto {
  protected readonly ts = inject(TranslationService);
  @Input({ required: true }) slides: PhotoCarouselSlide[] = [];
}
