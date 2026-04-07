import { Component, Input } from '@angular/core';
import gsap from 'gsap';
import { ResponsivePicture } from '../../../assets/responsive-picture/responsive-picture';
import { ResumEntryAnimation } from '../resum-entry-animation';

@Component({
  selector: 'app-resum-contact-links',
  imports: [ResponsivePicture],
  templateUrl: './resum-contact-links.html',
  styleUrl: './resum-contact-links.css',
})
export class ResumContactLinks extends ResumEntryAnimation {
  @Input({ required: true }) images!: any;
  protected readonly animationSelectors = '.contact-block, .contact-row';
  protected override animationDelay = 0.38;
  protected override animationStagger = 0.04;

  onHoverEnter(event: Event): void {
    if (!this.isBrowser) return;

    const row = event.currentTarget as HTMLElement | null;
    if (!row) return;

    const label = row.querySelector('.contact-label');
    const icon = row.querySelector('img');

    gsap.killTweensOf([row, label, icon]);

    gsap.to(row, {
      y: -2,
      scale: 1.012,
      duration: 0.2,
      ease: 'power2.out',
    });

    if (label) {
      gsap.to(label, {
        x: 3,
        duration: 0.22,
        ease: 'power2.out',
      });
    }

    if (icon) {
      gsap.to(icon, {
        rotate: -8,
        scale: 1.08,
        duration: 0.22,
        ease: 'power2.out',
      });
    }
  }

  onHoverLeave(event: Event): void {
    if (!this.isBrowser) return;

    const row = event.currentTarget as HTMLElement | null;
    if (!row) return;

    const label = row.querySelector('.contact-label');
    const icon = row.querySelector('img');

    gsap.killTweensOf([row, label, icon]);

    gsap.to(row, {
      y: 0,
      scale: 1,
      duration: 0.22,
      ease: 'power2.out',
    });

    if (label) {
      gsap.to(label, {
        x: 0,
        duration: 0.2,
        ease: 'power2.out',
      });
    }

    if (icon) {
      gsap.to(icon, {
        rotate: 0,
        scale: 1,
        duration: 0.2,
        ease: 'power2.out',
      });
    }
  }

  onPress(event: Event): void {
    if (!this.isBrowser) return;

    const row = event.currentTarget as HTMLElement | null;
    if (!row) return;

    gsap.killTweensOf(row);
    gsap.to(row, {
      y: 0,
      scale: 0.985,
      duration: 0.1,
      ease: 'power2.out',
    });
  }

  onRelease(event: Event): void {
    if (!this.isBrowser) return;

    const row = event.currentTarget as HTMLElement | null;
    if (!row) return;

    gsap.killTweensOf(row);
    gsap.to(row, {
      y: -2,
      scale: 1.012,
      duration: 0.14,
      ease: 'power2.out',
    });
  }
}
