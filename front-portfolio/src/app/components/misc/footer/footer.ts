import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ResponsivePicture } from '../../assets/responsive-picture/responsive-picture';
import { labeled, SHARED_IMAGES } from '../../../img-sources/shared.sources';
import { TranslationService } from '../../../services/translation.service';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, ResponsivePicture],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  protected readonly ts = inject(TranslationService);
  protected readonly githubIcon = labeled(SHARED_IMAGES.stack.github, 'GitHub');
  protected readonly linkedinIcon = labeled(SHARED_IMAGES.stack.linkedin, 'LinkedIn');
  protected readonly mailIcon = labeled(SHARED_IMAGES.stack.mail, 'Email');
}
