import { Component, OnInit } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ReportService } from '../../core/services/report-service';
import { ISalesReport } from '../../core/models/report.model';
import { getApiError } from '../../core/utils/get-api-error';

@Component({
  imports: [DatePipe, DecimalPipe, ReactiveFormsModule],
  selector: 'app-salesreport',
  styleUrl: './salesreport.css',
  templateUrl: './salesreport.html',
})
export class Salesreport implements OnInit {
  constructor(private _reportService: ReportService) {}
  report: ISalesReport | null = null;
  errorMessage = '';
  range = new FormGroup({
    startDate: new FormControl(''),
    endDate: new FormControl(''),
  });

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.errorMessage = '';
    this._reportService
      .getSalesReport(
        this.range.value.startDate || undefined,
        this.range.value.endDate || undefined,
      )
      .subscribe({
        next: (res) => (this.report = res.data),
        error: (err) => (this.errorMessage = getApiError(err)),
      });
  }

  get stats() {
    return this.report?.overallStats?.[0];
  }

  //the aggregation groups by {year, month} - rebuild the month for the date pipe
  monthDate(month: any) {
    return new Date(month.year, month.month - 1, 1);
  }
}
