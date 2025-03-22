import { ChangeDetectorRef, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from '../translation.service';
import { Subscription } from 'rxjs';

@Pipe({
  name: 'translation',
  standalone: true,
  pure: false 
})
export class TranslationPipe implements PipeTransform {
  constructor(
    private translationService: TranslationService,
    private ref: ChangeDetectorRef
  ) {}

  transform(value: string): string {
    return this.translationService.getTranslation(value);
  }

}