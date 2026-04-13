import { Component } from '@angular/core';
import {HomeResume} from './home-resume/home-resume';
import {HomeProjects} from './home-projects/home-projects';
import {HomeWork} from './home-work/home-work';
import {RevealOnScrollDirective} from '../../../directives/reveal-on-scroll';

@Component({
  selector: 'app-home',
  imports: [
    HomeResume,
    HomeProjects,
    HomeWork,
    RevealOnScrollDirective
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
