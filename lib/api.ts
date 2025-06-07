import { Category, PriceRange, Product } from '@/types/product';

export const PRICE_RANGES: PriceRange[] = [
  { label: 'Under $50', min: 0, max: 50 },
  { label: '$50 - $100', min: 50, max: 100 },
  { label: '$100 - $200', min: 100, max: 200 },
  { label: '$200 - $500', min: 200, max: 500 },
  { label: 'Over $500', min: 500, max: Infinity },
];

export async function getProducts(
  offset: number = 0,
  limit: number = 10
): Promise<Product[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/products?offset=${offset}&limit=${limit}`, {
      cache: 'force-cache',
      next: { revalidate: 3600 }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

export async function getProductById(id: string): Promise<Product> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/products/${id}`, {
      cache: 'force-cache',
      next: { revalidate: 3600 }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/categories`, {
      cache: 'force-cache',
      next: { revalidate: 3600 }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

export async function searchProducts(title: string): Promise<Product[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/products/?title=${encodeURIComponent(title)}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error('Failed to search products');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
}

export async function getProductsByCategory(categoryId: number): Promise<Product[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/categories/${categoryId}/products`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch products by category');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
}

export async function getProductsByPriceRange(min: number, max: number): Promise<Product[]> {
  try {
    const url = max === Infinity 
      ? `${process.env.NEXT_PUBLIC_API_BASE}/products/?price_min=${min}`
      : `${process.env.NEXT_PUBLIC_API_BASE}/products/?price_min=${min}&price_max=${max}`;
    
    const response = await fetch(url, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch products by price range');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching products by price range:', error);
    throw error;
  }
}

export async function getFilteredProducts(
  categoryIds: number[],
  priceRanges: PriceRange[]
): Promise<Product[]> {
  try {
    let products: Product[] = [];
        if (categoryIds.length === 0 && priceRanges.length === 0) {
      return getProducts(0, 100);
    }

    if (categoryIds.length > 0) {
      const categoryPromises = categoryIds.map(categoryId => getProductsByCategory(categoryId));
      const categoryResults = await Promise.all(categoryPromises);
      products = categoryResults.flat();
    } else {
      products = await getProducts(0, 100);
    }

    if (priceRanges.length > 0) {
      products = products.filter(product => {
        return priceRanges.some(range => {
          const price = product.price;
          if (range.max === Infinity) {
            return price >= range.min;
          }
          return price >= range.min && price <= range.max;
        });
      });
    }

    const uniqueProducts = products.filter((product, index, self) =>
      index === self.findIndex(p => p.id === product.id)
    );

    return uniqueProducts;
  } catch (error) {
    console.error('Error fetching filtered products:', error);
    throw error;
  }
}