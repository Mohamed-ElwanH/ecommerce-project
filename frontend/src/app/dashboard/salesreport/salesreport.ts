import { Component, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../../core/services/report-service';
import { ISalesReport } from '../../core/models/report.model';
import { getApiError } from '../../core/utils/get-api-error';

@Component({
  imports: [DecimalPipe, FormsModule],
  selector: 'app-salesreport',
  styleUrl: './salesreport.css',
  templateUrl: './salesreport.html',
})
export class Salesreport implements OnInit {
  constructor(private _reportService: ReportService) {}
  report: ISalesReport | null = null;
  startDate = '';
  endDate = '';
  errorMessage = '';

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.errorMessage = '';
    this._reportService
      .getSalesReport(this.startDate || undefined, this.endDate || undefined)
      .subscribe({
        next: (res) => (this.report = res.data),
        error: (err) => (this.errorMessage = getApiError(err)),
      });
  }

  get stats() {
    return this.report?.overallStats?.[0];
  }

  monthName(year: number, month: number) {
    return new Date(year, month - 1, 1).toLocaleString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  }
}
