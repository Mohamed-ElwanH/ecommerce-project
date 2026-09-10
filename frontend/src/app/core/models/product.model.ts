export interface IProduct {
  _id: string;
  name: string;
  desc: string;
  price: number;
  stock: number;
  images: string[];
  category: string; // ObjectId
  subCategory: string[]; // ObjectIds
  slug: string;
  isActive: boolean;
  isDeleted: boolean;
  isTopSale: boolean;
  isNewArrival: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IProductsResponse {
  message: string;
  data: IProduct[];
}

export interface IProductResponse {
  message: string;
  data: IProduct | null;
}

// Fields of POST /product (multipart form data) and PUT /product/:id (JSON)
export interface IProductPayload {
  name: string;
  desc: string;
  price: number;
  stock: number;
  category: string;
  subCategory: string[];
  slug: string;
}
