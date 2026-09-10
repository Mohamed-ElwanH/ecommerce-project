import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TestimonialService } from '../../core/services/testimonial-service';
import {
  ITestimonial,
  ICreateTestimonialData,
} from '../../core/models/testimonial.model';
import { getApiError } from '../../core/utils/get-api-error';

@Component({
  imports: [DatePipe, ReactiveFormsModule],
  selector: 'app-testimoniallist',
  styleUrl: './testimoniallist.css',
  templateUrl: './testimoniallist.html',
})
export class Testimoniallist implements OnInit {
  constructor(private _testimonialService: TestimonialService) {}
  testimonials: ITestimonial[] = [];
  errorMessage = '';
  successMessage = '';

  testimonialForm = new FormGroup({
    name: new FormControl(''),
    message: new FormControl(''),
  });

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
    this._testimonialService
      .createTestimonial(this.testimonialForm.value as ICreateTestimonialData)
      .subscribe({
        next: () => {
          this.successMessage = 'ok';
          this.testimonialForm.setValue({ name: '', message: '' });
        },
        error: (err) => (this.errorMessage = getApiError(err)),
      });
  }
}
