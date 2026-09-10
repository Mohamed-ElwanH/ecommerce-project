import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from '../services/translation-service';

//impure so templates re-render when the language changes
@Pipe({ name: 'translate', pure: false })
export class TranslatePipe implements PipeTransform {
  constructor(private translation: TranslationService) {}

  transform(key: string): string {
    return this.translation.instant(key);
  }
}
