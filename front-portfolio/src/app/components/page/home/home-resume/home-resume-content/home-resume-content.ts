import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { PhotoCarouselSlide } from '../../../../assets/photo-carousel/photo-carousel';
import { HomeResumePhoto } from './home-resume-photo/home-resume-photo';
import { HomeResumeSnippets } from './home-resume-snippets/home-resume-snippets';

@Component({
  selector: 'app-home-resume-content',
  imports: [HomeResumePhoto, HomeResumeSnippets],
  templateUrl: './home-resume-content.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './home-resume-content.css',
})
export class HomeResumeContent {
  @Input({ required: true }) photoSlides: PhotoCarouselSlide[] = [];
}
