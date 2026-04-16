import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  ResponsivePicture,
  ResponsiveSource,
} from '../../assets/responsive-picture/responsive-picture';
import { SHARED_IMAGES } from '../../../img-sources/shared.sources';

interface FooterIconSet {
  sources: ResponsiveSource[];
  fallback: string;
  alt: string;
}

@Component({
  selector: 'app-footer',
  imports: [RouterLink, ResponsivePicture],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  protected readonly githubIcon: FooterIconSet = {
    alt: 'GitHub',
    sources: SHARED_IMAGES.stack.github.sources,
    fallback: SHARED_IMAGES.stack.github.fallbackSrc,
  };
  protected readonly linkedinIcon: FooterIconSet = {
    alt: 'LinkedIn',
    sources: SHARED_IMAGES.stack.linkedin.sources,
    fallback: SHARED_IMAGES.stack.linkedin.fallbackSrc,
  };
  protected readonly mailIcon: FooterIconSet = {
    alt: 'Email',
    sources: SHARED_IMAGES.stack.mail.sources,
    fallback: SHARED_IMAGES.stack.mail.fallbackSrc,
  };
}
