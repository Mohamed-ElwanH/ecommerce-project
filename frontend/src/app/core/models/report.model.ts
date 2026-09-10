// Shape of GET /reports/sales (aggregation $facet result)
export interface ISalesOverallStats {
  totalSalesAmount: number;
  totalQuantitySold: number;
  numberOfOrders: number;
}

export interface ITopProduct {
  _id: string;
  name: string;
  revenue: number;
  totalQuantity: number;
}

export interface ITopUser {
  _id: string;
  name: string;
  totalSpent: number;
  totalOrders: number;
}

export interface IMonthlySales {
  _id: { year: number; month: number };
  totalRevenue: number;
  totalQuantity: number;
  totalOrders: number;
}

export interface ISalesReport {
  overallStats: ISalesOverallStats[]; // empty array when no orders in range
  topProducts: ITopProduct[];
  topUsers: ITopUser[];
  monthlySales: IMonthlySales[];
}

export interface ISalesReportResponse {
  message: string;
  data: ISalesReport;
}
