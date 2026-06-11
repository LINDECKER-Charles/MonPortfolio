import { Component, Input } from '@angular/core';
import {
  ResponsivePicture,
  ResponsiveSource,
} from '../../../../assets/responsive-picture/responsive-picture';

interface BannerIcon {
  sources: ResponsiveSource[];
  fallbackSrc: string;
  alt: string;
}

@Component({
  selector: 'app-home-resume-banner',
  imports: [ResponsivePicture],
  templateUrl: './home-resume-banner.html',
  styleUrl: './home-resume-banner.css',
})
export class HomeResumeBanner {
  @Input({ required: true }) leftIcons: BannerIcon[] = [];
  @Input({ required: true }) rightIcons: BannerIcon[] = [];
  @Input({ required: true }) label = '';
}
