import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TestimonialService } from '../../core/services/testimonial-service';
import { ITestimonial } from '../../core/models/testimonial.model';

@Component({
  imports: [DatePipe],
  selector: 'app-testimonialmoderation',
  styleUrl: './testimonialmoderation.css',
  templateUrl: './testimonialmoderation.html',
})
export class Testimonialmoderation implements OnInit {
  constructor(private _testimonialService: TestimonialService) {}
  testimonials: ITestimonial[] = [];
  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    this.load();
  }

  load() {
    this._testimonialService.getAllTestimonials().subscribe({
      next: (res) => (this.testimonials = res.data),
      error: (err) => (this.errorMessage = err.error?.error),
    });
  }

  approve(testimonial: ITestimonial) {
    this.act(() => this._testimonialService.approveTestimonial(testimonial._id));
  }

  hide(testimonial: ITestimonial) {
    this.act(() => this._testimonialService.hideTestimonial(testimonial._id));
  }

  remove(testimonial: ITestimonial) {
    if (!confirm('Delete this testimonial permanently?')) return;
    this.act(() => this._testimonialService.deleteTestimonial(testimonial._id));
  }

  private act(call: () => any) {
    this.errorMessage = '';
    this.successMessage = '';
    call().subscribe({
      next: (res: any) => {
        this.successMessage = res.message;
        this.load();
      },
      error: (err: any) => (this.errorMessage = err.error?.error),
    });
  }
}
