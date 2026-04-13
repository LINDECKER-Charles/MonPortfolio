import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  ResponsivePicture,
  ResponsiveSource,
} from '../../assets/responsive-picture/responsive-picture';

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
  protected readonly githubIcon = this.buildStackIconSet('github', 'GitHub');
  protected readonly linkedinIcon = this.buildStackIconSet('linkedin', 'LinkedIn');
  protected readonly mailIcon = this.buildStackIconSet('mail', 'Email');

  private buildStackIconSet(name: string, alt: string): FooterIconSet {
    return {
      alt,
      sources: [
        { src: `/icon/stack/24x24_${name}.webp`, maxWidth: 320, type: 'image/webp' },
        { src: `/icon/stack/40x40_${name}.webp`, maxWidth: 480, type: 'image/webp' },
        { src: `/icon/stack/80x80_${name}.webp`, maxWidth: 768, type: 'image/webp' },
        { src: `/icon/stack/160x160_${name}.webp`, maxWidth: 1200, type: 'image/webp' },
        { src: `/icon/stack/${name}.webp`, type: 'image/webp' },
      ],
      fallback: `/icon/stack/${name}.webp`,
    };
  }
}
