import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Mobius} from './components/three/mobius/mobius';

@Component({
  selector: 'app-root',
  imports: [Mobius],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('front-portfolio');
}
