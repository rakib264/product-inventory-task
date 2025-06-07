import { ProductTableSkeleton } from '@/components/product-skeleton';
import ProductTable from '@/components/product-table';
import { getCategories, getProducts } from '@/lib/api';
import { Suspense } from 'react';

export default async function Home() {
  try {
    const [products, categories] = await Promise.all([
      getProducts(0, 100),
      getCategories(),
    ]);

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-left mb-2">Product Inventory</h1>
          <p className="text-muted-foreground text-left">
            Discover and explore our comprehensive product catalog
          </p>
        </div>

        <Suspense fallback={<ProductTableSkeleton />}>
          <ProductTable
            initialProducts={products}
            categories={categories}
            itemsPerPage={10}
          />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error('Error loading products:', error);
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Error Loading Products</h1>
          <p className="text-muted-foreground">
            We encountered an issue while loading the product catalog. Please try again later.
          </p>
        </div>
      </div>
    );
  }
}