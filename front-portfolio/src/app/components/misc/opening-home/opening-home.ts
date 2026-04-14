import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Opening } from '../opening-resume/opening/opening';

@Component({
  selector: 'app-opening-home',
  imports: [Opening],
  templateUrl: './opening-home.html',
  styleUrl: './opening-home.css',
})
export class OpeningHome {
  private readonly router = inject(Router);

  protected goHome(): void {
    void this.router.navigateByUrl('/');
  }
}
