import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../enviroments/env';
import {
  ITestimonialsResponse,
  ITestimonialResponse,
  ICreateTestimonialData,
} from '../models/testimonial.model';

@Injectable({
  providedIn: 'root',
})
export class TestimonialService {
  private apiURL = environment.apiURL + 'testimonial';
  constructor(private _http: HttpClient) {}

  //public: submitting and listing approved testimonials needs no token
  createTestimonial(data: ICreateTestimonialData) {
    return this._http.post<ITestimonialResponse>(this.apiURL, data);
  }
  getApprovedTestimonials() {
    return this._http.get<ITestimonialsResponse>(this.apiURL);
  }

  //admin moderation (approve path matches the server route spelling)
  getAllTestimonials() {
    return this._http.get<ITestimonialsResponse>(
      this.apiURL + '/all-testimonial',
    );
  }
  approveTestimonial(id: string) {
    return this._http.put<ITestimonialResponse>(
      this.apiURL + `/approve-testimonial/${id}`,
      {},
    );
  }
  hideTestimonial(id: string) {
    return this._http.put<ITestimonialResponse>(
      this.apiURL + `/hide-testimonial/${id}`,
      {},
    );
  }
  deleteTestimonial(id: string) {
    return this._http.delete<ITestimonialResponse>(
      this.apiURL + `/delete-testimonial/${id}`,
    );
  }
}
