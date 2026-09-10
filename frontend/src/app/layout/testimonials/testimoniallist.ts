import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TestimonialService } from '../../core/services/testimonial-service';
import { ITestimonial } from '../../core/models/testimonial.model';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { getApiError } from '../../core/utils/get-api-error';

@Component({
  imports: [DatePipe, FormsModule, TranslatePipe],
  selector: 'app-testimoniallist',
  styleUrl: './testimoniallist.css',
  templateUrl: './testimoniallist.html',
})
export class Testimoniallist implements OnInit {
  constructor(private _testimonialService: TestimonialService) {}
  testimonials: ITestimonial[] = [];
  errorMessage = '';
  successMessage = '';

  form = { name: '', message: '' };

  ngOnInit(): void {
    this.loadApproved();
  }

  loadApproved() {
    this._testimonialService.getApprovedTestimonials().subscribe({
      next: (res) => (this.testimonials = res.data),
      error: (err) => (this.errorMessage = getApiError(err)),
    });
  }

  submit() {
    this.errorMessage = '';
    this.successMessage = '';
    this._testimonialService.createTestimonial(this.form).subscribe({
      next: () => {
        this.successMessage = 'ok';
        this.form = { name: '', message: '' };
      },
      error: (err) => (this.errorMessage = getApiError(err)),
    });
  }
}
