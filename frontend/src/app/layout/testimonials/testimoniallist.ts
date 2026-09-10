import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TestimonialService } from '../../core/services/testimonial-service';
import { ITestimonial } from '../../core/models/testimonial.model';

@Component({
  imports: [DatePipe, FormsModule],
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
      error: (err) => (this.errorMessage = err.error?.error),
    });
  }

  submit() {
    this.errorMessage = '';
    this.successMessage = '';
    this._testimonialService.createTestimonial(this.form).subscribe({
      next: () => {
        this.successMessage =
          'Thank you! Your testimonial was submitted and is awaiting approval.';
        this.form = { name: '', message: '' };
      },
      error: (err) => (this.errorMessage = err.error?.error),
    });
  }
}
