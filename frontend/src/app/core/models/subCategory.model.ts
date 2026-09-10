export interface ISubCategory {
  _id: string;
  name: string;
  slug: string;
  category: string; // ObjectId of the parent category
  isActive: boolean;
  isDeleted: boolean;
}

export interface ISubCategoriesResponse {
  message: string;
  data: ISubCategory[];
}

export interface ISubCategoryResponse {
  message: string;
  data: ISubCategory | null;
}
