import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth-service';
import { TranslationService } from '../../../core/services/translation-service';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';

@Component({
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  selector: 'app-header',
  styleUrl: './header.css',
  templateUrl: './header.html',
})
export class Header {
  constructor(
    private _authService: AuthService,
    protected translation: TranslationService,
  ) {}
  logout() {
    this._authService.logout();
  }
}
