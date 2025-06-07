'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getFilteredProducts, PRICE_RANGES, searchProducts } from '@/lib/api';
import { Category, Product } from '@/types/product';
import { ArrowDown, ArrowUp, ArrowUpDown, Eye, Search, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import ProductFilters from './product-filters';
import { ProductTableSkeleton } from './product-skeleton';

interface ProductTableProps {
  initialProducts: Product[];
  categories: Category[];
  itemsPerPage: number;
}

export default function ProductTable({
  initialProducts,
  categories,
  itemsPerPage,
}: ProductTableProps) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'title' | 'price'>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      let aValue, bValue;
      
      if (sortBy === 'price') {
        aValue = a.price;
        bValue = b.price;
      } else {
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [products, searchTerm, sortBy, sortOrder]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredAndSortedProducts.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);

  const handleSearch = async (term: string) => {
    const trimmedTerm = term.trim();
    setSearchTerm(trimmedTerm);
    setCurrentPage(1); 
    
    if (trimmedTerm) {
      setLoading(true);
      try {
        const searchResults = await searchProducts(trimmedTerm);
        setProducts(searchResults);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setProducts(initialProducts);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setProducts(initialProducts);
    setCurrentPage(1);
  };

  const applyFilters = async () => {
    if (selectedCategories.length === 0 && selectedPriceRanges.length === 0) {
      setProducts(initialProducts);
      return;
    }

    setLoading(true);
    try {
      const selectedRanges = PRICE_RANGES.filter(range => 
        selectedPriceRanges.includes(range.label)
      );
      
      const filteredProducts = await getFilteredProducts(selectedCategories, selectedRanges);
      setProducts(filteredProducts);
    } catch (error) {
      console.error('Filter failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    applyFilters();
  }, [selectedCategories, selectedPriceRanges]);

  const handleSort = (field: 'title' | 'price') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field: 'title' | 'price') => {
    if (sortBy !== field) return <ArrowUpDown className="w-4 h-4" />;
    return sortOrder === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />;
  };

  const handleCategoryChange = (categoryIds: number[]) => {
    setSelectedCategories(categoryIds);
  };

  const handlePriceRangeChange = (priceRanges: string[]) => {
    setSelectedPriceRanges(priceRanges);
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedPriceRanges([]);
    setSearchTerm('');
    setProducts(initialProducts);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1">
        <ProductFilters
          categories={categories}
          selectedCategories={selectedCategories}
          selectedPriceRanges={selectedPriceRanges}
          onCategoryChange={handleCategoryChange}
          onPriceRangeChange={handlePriceRangeChange}
          onClearFilters={handleClearFilters}
        />
      </div>

      <div className="lg:col-span-3 space-y-6">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 pr-10 w-full"
          />
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="text-sm text-muted-foreground">
            {loading ? (
              "Searching products..."
            ) : (
              `Showing ${paginatedProducts.length} of ${filteredAndSortedProducts.length} products`
            )}
          </p>
        </div>

        {loading ? (
          <ProductTableSkeleton />
        ) : filteredAndSortedProducts.length === 0 ? (
          <div className="rounded-md border p-8">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                We couldn't find any products matching your search criteria
              </p>
              <Button onClick={handleClearSearch} variant="outline" size="sm">
                Clear search
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px] min-w-[100px]">Image</TableHead>
                  <TableHead className="min-w-[200px]">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('title')}
                      className="flex items-center space-x-1 -ml-4"
                    >
                      <span>Product</span>
                      {getSortIcon('title')}
                    </Button>
                  </TableHead>
                  <TableHead className="min-w-[120px]">Category</TableHead>
                  <TableHead className="min-w-[100px]">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('price')}
                      className="flex items-center space-x-1 -ml-4"
                    >
                      <span>Price</span>
                      {getSortIcon('price')}
                    </Button>
                  </TableHead>
                  <TableHead className="text-right min-w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="min-w-[100px]">
                      <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-100">
                        {product.images && product.images.length > 0 ? (
                          <Image
                            src={product.images[0]}
                            alt={product.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 64px, 64px"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400 text-xs">No Image</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="min-w-[200px]">
                      <div>
                        <h3 className="font-medium line-clamp-1">{product.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {product.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="min-w-[120px]">
                      <Badge variant="outline" className="whitespace-nowrap">
                        {product.category.name}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium min-w-[100px]">
                      ${product.price.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right min-w-[100px]">
                      <Link href={`/products/${product.id}`}>
                        <Button size="sm" className="flex items-center space-x-1 whitespace-nowrap">
                          <Eye className="w-4 h-4" />
                          <span className="hidden sm:inline">View</span>
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button 
              variant="outline" 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="whitespace-nowrap"
            >
              Previous
            </Button>
            
            <div className="hidden sm:flex items-center gap-2">
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const pageNum = Math.max(1, currentPage - 2) + i;
                if (pageNum > totalPages) return null;
                
                return (
                  <Button 
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <div className="sm:hidden flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
            </div>
            
            <Button 
              variant="outline" 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="whitespace-nowrap"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}