import { Component, inject } from '@angular/core';
import { TranslationService } from '../../../services/translation.service';


@Component({
  selector: 'app-loading',
  imports: [],
  templateUrl: './loading.html',
  styleUrl: './loading.css',
})
export class Loading {
  protected readonly ts = inject(TranslationService);
  public isLoading: boolean = false;
}
