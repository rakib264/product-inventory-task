import { getProductById, getProducts } from '@/lib/api';
import { ArrowLeftIcon } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PreviewPageProps {
  params: {
    id: string;
  };
}

export async function generateStaticParams() {
  try {
    const products = await getProducts(0, 100);
    return products.map((product) => ({
      id: product.id.toString(),
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export async function generateMetadata({ params }: PreviewPageProps): Promise<Metadata> {
  try {
    const product = await getProductById(params.id);


    
    return {
      title: `${product.title} - Premium Product | Your Store`,
      description: `${product.description.substring(0, 150)}... Available for $${product.price}. Shop now with free shipping!`,
      keywords: `${product.title}, ${product.category.name}, ecommerce, online shopping`,
      openGraph: {
        title: product.title,
        description: product.description,
        images: product.images.length > 0 ? [
          {
            url: product.images[0],
            width: 800,
            height: 600,
            alt: product.title,
          }
        ] : [],
        type: 'website',
        siteName: 'Product Inventory',
      },
      twitter: {
        card: 'summary_large_image',
        title: product.title,
        description: product.description,
        images: product.images.length > 0 ? [product.images[0]] : [],
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.',
    };
  }
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  try {
    const product = await getProductById(params.id);

    if (!product) {
      notFound();
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 w-[100px]">
            <Link href={`/products/${params.id}`}>
            <div className="bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 p-2 rounded-md flex items-center space-x-2 w-[100px] cursor-pointer justify-center">
              <ArrowLeftIcon className="w-4 h-4 dark:text-gray-200" />
              <span className="dark:text-gray-200">Back</span>
            </div>
            </Link>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 p-8 rounded-lg mb-8">
            <h1 className="text-4xl font-bold text-center mb-4 dark:text-white">SEO Preview</h1>
            <p className="text-center text-muted-foreground dark:text-gray-300">
              This page demonstrates server-side rendering with optimized metadata for search engines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold dark:text-white">Product Information</h2>
              <div className="space-y-2 dark:text-gray-300">
                <p><strong className="dark:text-white">Title:</strong> {product.title}</p>
                <p><strong className="dark:text-white">Price:</strong> ${product.price.toFixed(2)}</p>
                <p><strong className="dark:text-white">Category:</strong> {product.category.name}</p>
                <p><strong className="dark:text-white">Created:</strong> {new Date(product.creationAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold dark:text-white">SEO Metadata</h2>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-sm dark:text-gray-300">
                <p><strong className="dark:text-white">Page Title:</strong> {product.title} - Premium Product | Your Store</p>
                <p><strong className="dark:text-white">Meta Description:</strong> {product.description.substring(0, 150)}...</p>
                <p><strong className="dark:text-white">Keywords:</strong> {product.title}, {product.category.name}, ecommerce</p>
                <p><strong className="dark:text-white">Open Graph:</strong> Optimized for social sharing</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">Product Description</h2>
            <p className="text-muted-foreground dark:text-gray-300 leading-relaxed">{product.description}</p>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground dark:text-gray-400">
              This page is server-rendered with optimized metadata for better SEO performance.
            </p>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading product preview:', error);
    notFound();
  }
}