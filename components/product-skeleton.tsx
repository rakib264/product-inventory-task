import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function ProductTableSkeleton() {
  return (
    <>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] min-w-[100px]">Image</TableHead>
              <TableHead className="min-w-[200px]">Product</TableHead>
              <TableHead className="min-w-[120px]">Category</TableHead>
              <TableHead className="min-w-[100px]">Price</TableHead>
              <TableHead className="text-right min-w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(10)].map((_, i) => (
              <TableRow key={i}>
                <TableCell className="min-w-[100px]">
                  <Skeleton className="h-16 w-16 rounded-md" />
                </TableCell>
                <TableCell className="min-w-[200px]">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full max-w-[250px]" />
                    <Skeleton className="h-4 w-full max-w-[200px]" />
                  </div>
                </TableCell>
                <TableCell className="min-w-[120px]">
                  <Skeleton className="h-6 w-[100px]" />
                </TableCell>
                <TableCell className="min-w-[100px]">
                  <Skeleton className="h-4 w-[80px]" />
                </TableCell>
                <TableCell className="text-right min-w-[100px]">
                  <Skeleton className="h-9 w-[100px] ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

export function ProductDetailsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Skeleton className="h-96 w-full rounded-lg" />
          <div className="flex space-x-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-20 rounded-md" />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/4" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </div>
  );
}