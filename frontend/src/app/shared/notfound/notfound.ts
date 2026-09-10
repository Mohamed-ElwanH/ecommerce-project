import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../core/pipes/translate.pipe';

@Component({
  imports: [RouterLink, TranslatePipe],
  selector: 'app-notfound',
  styleUrl: './notfound.css',
  templateUrl: './notfound.html',
})
export class Notfound {}
