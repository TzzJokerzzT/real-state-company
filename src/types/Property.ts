export interface Property {
  id?: string;
  idOwner: string;
  name: string;
  address: string;
  price: number;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePropertyDto {
  idOwner: string;
  name: string;
  address: string;
  price: number;
  image: string;
}

export interface UpdatePropertyDto {
  id?: string;
  idOwner: string;
  name: string;
  address: string;
  price: number;
  image: string;
}

export interface PropertyFilterDto {
  name?: string;
  address?: string;
  minPrice?: number;
  maxPrice?: number;
  idOwner?: string;
  page?: number;
  pageSize?: number;
}

export interface PropertyResponse {
  properties: Property[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
