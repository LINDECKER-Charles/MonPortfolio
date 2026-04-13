import { Component } from '@angular/core';
import {HomeResume} from './home-resume/home-resume';

@Component({
  selector: 'app-home',
  imports: [
    HomeResume
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
