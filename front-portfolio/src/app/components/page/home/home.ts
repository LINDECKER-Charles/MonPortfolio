import { Component } from '@angular/core';
import {HomeResume} from './home-resume/home-resume';
import {HomeProjects} from './home-projects/home-projects';
import {HomeWork} from './home-work/home-work';

@Component({
  selector: 'app-home',
  imports: [
    HomeResume,
    HomeProjects,
    HomeWork
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
