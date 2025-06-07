import { ProductTableSkeleton } from '@/components/product-skeleton';
import ProductTable from '@/components/product-table';
import { getCategories, getProducts } from '@/lib/api';
import { Suspense } from 'react';

interface HomeProps {
  searchParams: {
    page?: string;
  };
}

export default async function Home({ searchParams }: HomeProps) {
  const currentPage = parseInt(searchParams.page || '1');
  const itemsPerPage = 10;
  const offset = (currentPage - 1) * itemsPerPage;

  try {
    const [products, categories] = await Promise.all([
      getProducts(offset, itemsPerPage * 6),
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
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
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