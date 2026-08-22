import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Opening } from './opening/opening';
import { Resum } from './resum/resum';

@Component({
  selector: 'app-opening-resume',
  imports: [Opening, Resum],
  templateUrl: './opening-resume.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './opening-resume.css',
})
export class OpeningResume {
  public showResume = false;

  public onOpeningFinished(): void {
    this.showResume = true;
  }
}
