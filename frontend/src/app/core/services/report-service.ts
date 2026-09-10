import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../enviroments/env';
import { ISalesReportResponse } from '../models/report.model';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private apiURL = environment.apiURL + 'reports';
  constructor(private _http: HttpClient) {}

  //startDate / endDate are query params (YYYY-MM-DD)
  getSalesReport(startDate?: string, endDate?: string) {
    let params = new HttpParams();
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);
    return this._http.get<ISalesReportResponse>(this.apiURL + '/sales', {
      params,
    });
  }
}
