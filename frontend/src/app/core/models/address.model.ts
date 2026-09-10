export interface IAddress {
  _id: string;
  title: string;
  street: string;
  city: string;
  area?: string;
  building?: string;
  floor?: string;
  apartment?: string;
  notes?: string;
  isDefault?: boolean;
}

// addAddress / deleteAddress / setDefaultAddress return the whole list
export interface IAddressesResponse {
  message: string;
  data: IAddress[];
}

// updateAddress returns the updated address itself
export interface IAddressResponse {
  message: string;
  data: IAddress;
}
