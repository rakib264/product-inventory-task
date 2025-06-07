import { ProductTableSkeleton } from '@/components/product-skeleton';

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="h-10 bg-gray-200 rounded w-1/3 mx-auto mb-2 animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto animate-pulse"></div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="h-96 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
        <div className="lg:col-span-3">
          <ProductTableSkeleton />
        </div>
      </div>
    </div>
  );
}