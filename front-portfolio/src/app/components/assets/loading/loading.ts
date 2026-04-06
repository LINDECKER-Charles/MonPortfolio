import {
  Component,
} from '@angular/core';


@Component({
  selector: 'app-loading',
  imports: [],
  templateUrl: './loading.html',
  styleUrl: './loading.css',
})
export class Loading {
  public isLoading: boolean = false;
}
