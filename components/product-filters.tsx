'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Label } from '@/components/ui/label';
import { PRICE_RANGES } from '@/lib/api';
import { Category } from '@/types/product';
import { Filter, X } from 'lucide-react';
import { useState } from 'react';

interface ProductFiltersProps {
  categories: Category[];
  selectedCategories: number[];
  selectedPriceRanges: string[];
  onCategoryChange: (categoryIds: number[]) => void;
  onPriceRangeChange: (ranges: string[]) => void;
  onClearFilters: () => void;
}

export default function ProductFilters({
  categories,
  selectedCategories,
  selectedPriceRanges,
  onCategoryChange,
  onPriceRangeChange,
  onClearFilters,
}: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(true);

  const handleCategoryChange = (categoryId: number, checked: boolean) => {
    if (checked) {
      onCategoryChange([...selectedCategories, categoryId]);
    } else {
      onCategoryChange(selectedCategories.filter(id => id !== categoryId));
    }
  };

  const handlePriceRangeChange = (rangeLabel: string, checked: boolean) => {
    if (checked) {
      onPriceRangeChange([...selectedPriceRanges, rangeLabel]);
    } else {
      onPriceRangeChange(selectedPriceRanges.filter(label => label !== rangeLabel));
    }
  };

  const removeCategory = (categoryId: number) => {
    onCategoryChange(selectedCategories.filter(id => id !== categoryId));
  };

  const removePriceRange = (rangeLabel: string) => {
    onPriceRangeChange(selectedPriceRanges.filter(label => label !== rangeLabel));
  };

  const hasActiveFilters = selectedCategories.length > 0 || selectedPriceRanges.length > 0;

  return (
    <Card className="p-6 h-fit">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between mb-4">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="p-0 h-auto font-semibold text-lg">
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </Button>
          </CollapsibleTrigger>
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={onClearFilters}>
              Clear All
            </Button>
          )}
        </div>

        <CollapsibleContent className="space-y-6">
          {hasActiveFilters && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Active Filters</Label>
              <div className="flex flex-wrap gap-2">
                {selectedCategories.map(categoryId => {
                  const category = categories.find(c => c.id === categoryId);
                  return category ? (
                    <Badge key={categoryId} variant="secondary" className="flex items-center gap-1">
                      {category.name}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-destructive"
                        onClick={() => removeCategory(categoryId)}
                      />
                    </Badge>
                  ) : null;
                })}
                {selectedPriceRanges.map(rangeLabel => (
                  <Badge key={rangeLabel} variant="secondary" className="flex items-center gap-2">
                    {rangeLabel}
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-destructive"
                      onClick={() => removePriceRange(rangeLabel)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Label className="text-sm font-medium">Categories</Label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {categories.map(category => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={(checked) => 
                      handleCategoryChange(category.id, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`category-${category.id}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {category.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Price Range</Label>
            <div className="space-y-2">
              {PRICE_RANGES.map(range => (
                <div key={range.label} className="flex items-center space-x-2">
                  <Checkbox
                    id={`price-${range.label}`}
                    checked={selectedPriceRanges.includes(range.label)}
                    onCheckedChange={(checked) => 
                      handlePriceRangeChange(range.label, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`price-${range.label}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {range.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}