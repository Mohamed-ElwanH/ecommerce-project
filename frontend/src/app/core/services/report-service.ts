import { HttpClient } from '@angular/common/http';
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
    let url = this.apiURL + '/sales';
    if (startDate) url += '?startDate=' + encodeURIComponent(startDate);
    if (endDate) url += '&endDate=' + encodeURIComponent(endDate);
    return this._http.get<ISalesReportResponse>(url);
  }
}
