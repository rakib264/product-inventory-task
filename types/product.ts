export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: {
    id: number;
    name: string;
    image: string;
    creationAt: string;
    updatedAt: string;
  };
  images: string[];
  creationAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  image: string;
  creationAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  hasMore: boolean;
}

export interface ProductFilters {
  search: string;
  categories: number[];
  priceRanges: string[];
  sortBy: 'title' | 'price';
  sortOrder: 'asc' | 'desc';
}

export interface PriceRange {
  label: string;
  min: number;
  max: number;
}