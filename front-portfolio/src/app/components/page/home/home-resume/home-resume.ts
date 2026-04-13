import { Component } from '@angular/core';
import {ResponsivePicture} from '../../../assets/responsive-picture/responsive-picture';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-home-resume',
  imports: [
    ResponsivePicture,
    RouterLink
  ],
  templateUrl: './home-resume.html',
  styleUrl: './home-resume.css',
})
export class HomeResume {

}
