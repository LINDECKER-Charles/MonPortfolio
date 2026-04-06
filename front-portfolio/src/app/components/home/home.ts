import { Component } from '@angular/core';
import {Opening} from '../opening/opening';

@Component({
  selector: 'app-home',
  imports: [
    Opening
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
