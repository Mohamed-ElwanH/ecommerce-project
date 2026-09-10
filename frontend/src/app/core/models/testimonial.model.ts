export interface ITestimonial {
  _id: string;
  name: string;
  message: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ITestimonialsResponse {
  message: string;
  data: ITestimonial[];
}

export interface ITestimonialResponse {
  message: string;
  data: ITestimonial;
}

export interface ICreateTestimonialData {
  name: string;
  message: string;
}
