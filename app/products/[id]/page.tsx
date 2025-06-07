import { Badge } from '@/components/ui/badge';
import { getProductById, getProducts } from '@/lib/api';
import { ArrowLeftIcon, EyeIcon } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductImages from './product-images';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export async function generateStaticParams() {
  const products = await getProducts(0, 100);
  return products.map((product) => ({
    id: product.id.toString(),
  }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  try {
    const product = await getProductById(params.id);
    return {
      title: `${product.title} | Startiv Shop`,
      description: product.description,
    };
  } catch (error) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.',
    };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  try {
    const product = await getProductById(params.id);

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
          <Link
            href={`/products/${params.id}/preview`}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 bg-gray-100 px-3 py-2 rounded-md"
          >
            <EyeIcon className="mr-2 h-4 w-4" />
            SEO Preview
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative">
            <ProductImages images={product.images} title={product.title} />
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
              <Badge variant="secondary" className="text-lg">
                ${product.price.toFixed(2)}
              </Badge>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Category</h2>
              <Badge variant="outline">{product.category.name}</Badge>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-gray-600">{product.description}</p>
            </div>

          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading product:', error);
    notFound();
  }
}
