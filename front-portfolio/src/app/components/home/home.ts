import { Component } from '@angular/core';
import {Opening} from './opening/opening';
import {Resum} from './resum/resum';

@Component({
  selector: 'app-home',
  imports: [
    Opening,
    Resum
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  public showResume = false;

  public onOpeningFinished(): void {
    this.showResume = true;
  }
}
