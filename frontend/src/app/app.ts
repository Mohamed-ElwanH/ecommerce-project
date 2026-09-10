import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './shared/footer/footer';
import { AuthService } from './core/services/auth-service';
import { TranslationService } from './core/services/translation-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('mystore');
  constructor(
    private _authService: AuthService,
    private _translation: TranslationService,
  ) {}
  ngOnInit(): void {
    this._authService.checkIfLogin();
  }
}
