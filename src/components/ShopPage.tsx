import React, { useState, useMemo } from 'react';
import { 
  Filter, 
  X, 
  Search, 
  ChevronDown, 
  SlidersHorizontal, 
  RotateCcw,
  Check
} from 'lucide-react';
import { Product, ProductVariation, ProductCategory } from '../types';
import { ProductCard } from './ProductCard';

interface ShopPageProps {
  products: Product[];
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  onAddToCart: (product: Product, variation?: ProductVariation, quantity?: number) => void;
  onOpenDetails: (product: Product, variationId?: string) => void;
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  initialSearchQuery?: string;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  products,
  selectedCategory,
  onCategoryChange,
  onAddToCart,
  onOpenDetails,
  wishlist,
  onToggleWishlist,
  initialSearchQuery = '',
}) => {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedCementGrade, setSelectedCementGrade] = useState('all');
  const [selectedSteelSize, setSelectedSteelSize] = useState('all');
  const [availabilityOnly, setAvailabilityOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name-asc'>('featured');

  // Extract unique brands for filtering
  const allBrands = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.brand) set.add(p.brand);
    });
    return Array.from(set);
  }, [products]);

  // Categories list
  const categories = [
    'All Categories',
    'Cement',
    'TMT Steel',
    'Steel Barricades',
    'Concrete Barricades',
    'Bricks & Blocks',
    'Sand',
    'Aggregates',
    'Construction Hardware',
  ];

  const cementGrades = ['OPC 43', 'OPC 53', 'PPC', 'Weather-Proof'];
  const steelSizes = ['8mm', '10mm', '12mm', '16mm', '20mm', '25mm', '32mm'];

  // Reset all filters
  const resetFilters = () => {
    onCategoryChange('all');
    setSelectedBrand('all');
    setSelectedCementGrade('all');
    setSelectedSteelSize('all');
    setAvailabilityOnly(false);
    setSearchQuery('');
    setSortBy('featured');
  };

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }

      // Brand filter
      if (selectedBrand !== 'all' && p.brand !== selectedBrand) {
        return false;
      }

      // Cement grade filter
      if (selectedCementGrade !== 'all') {
        const hasGrade = p.variations?.some((v) => v.grade === selectedCementGrade);
        if (!hasGrade) return false;
      }

      // Steel size filter
      if (selectedSteelSize !== 'all') {
        const hasSize = p.variations?.some((v) => v.size === selectedSteelSize);
        if (!hasSize) return false;
      }

      // Availability filter
      if (availabilityOnly && p.stock <= 0) {
        return false;
      }

      // Search Query filter (matches name, brand, SKU, tags, specs, size)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesBrand = p.brand.toLowerCase().includes(q);
        const matchesSku = p.sku.toLowerCase().includes(q);
        const matchesCat = p.category.toLowerCase().includes(q);
        const matchesTags = p.tags?.some((t) => t.toLowerCase().includes(q));
        const matchesVariation = p.variations?.some(
          (v) =>
            v.name.toLowerCase().includes(q) ||
            (v.size && v.size.toLowerCase().includes(q)) ||
            (v.grade && v.grade.toLowerCase().includes(q))
        );

        if (!matchesName && !matchesBrand && !matchesSku && !matchesCat && !matchesTags && !matchesVariation) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.basePrice - b.basePrice;
      if (sortBy === 'price-desc') return b.basePrice - a.basePrice;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [
    products,
    selectedCategory,
    selectedBrand,
    selectedCementGrade,
    selectedSteelSize,
    availabilityOnly,
    searchQuery,
    sortBy,
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Title & Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
            {selectedCategory === 'all' ? 'Materials Catalog & Inventory' : selectedCategory}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse genuine construction materials available for wholesale supply and direct site delivery.
          </p>
        </div>

        {/* Global Search Bar */}
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search 12mm, OPC 53, UltraTech..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 shadow-2xs"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden p-2.5 border border-slate-200 bg-white rounded-lg text-slate-700 hover:text-slate-900 flex items-center gap-1.5 text-xs font-bold"
          >
            <SlidersHorizontal className="w-4 h-4 text-amber-600" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        {/* DESKTOP FILTER SIDEBAR */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <SlidersHorizontal className="w-4 h-4 text-amber-600" />
              <span>Catalog Filters</span>
            </div>
            <button
              onClick={resetFilters}
              className="text-xs text-slate-500 hover:text-amber-600 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Categories Filter */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Categories
            </span>
            <div className="space-y-1">
              {categories.map((cat) => {
                const isSelected = (cat === 'All Categories' && selectedCategory === 'all') || selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => onCategoryChange(cat === 'All Categories' ? 'all' : cat)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{cat}</span>
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Brand Filter */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Brand / Manufacturer
            </span>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full text-xs font-semibold p-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-slate-900"
            >
              <option value="all">All Brands</option>
              {allBrands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          {/* Cement Grade Filter */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Cement Grade
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => setSelectedCementGrade('all')}
                className={`px-2 py-1 text-xs rounded font-medium border transition-colors ${
                  selectedCementGrade === 'all'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                All Grades
              </button>
              {cementGrades.map((grade) => (
                <button
                  key={grade}
                  onClick={() => setSelectedCementGrade(selectedCementGrade === grade ? 'all' : grade)}
                  className={`px-2 py-1 text-xs rounded font-medium border transition-colors ${
                    selectedCementGrade === grade
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {grade}
                </button>
              ))}
            </div>
          </div>

          {/* Steel Size Filter */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              TMT Steel Rebar Size
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => setSelectedSteelSize('all')}
                className={`px-2 py-1 text-xs rounded font-medium border transition-colors ${
                  selectedSteelSize === 'all'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                All Sizes
              </button>
              {steelSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSteelSize(selectedSteelSize === size ? 'all' : size)}
                  className={`px-2 py-1 text-xs rounded font-medium border transition-colors ${
                    selectedSteelSize === size
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Availability Checkbox */}
          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
              <input
                type="checkbox"
                checked={availabilityOnly}
                onChange={(e) => setAvailabilityOnly(e.target.checked)}
                className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
              />
              <span>In Stock Only</span>
            </label>
          </div>
        </aside>

        {/* MAIN PRODUCT GRID & SORTING */}
        <main className="lg:col-span-9">
          {/* Active Filter Bar & Results Count */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100 text-xs">
            <span className="text-slate-600 font-medium">
              Showing <strong className="text-slate-900">{filteredProducts.length}</strong> products
            </span>

            <div className="flex items-center gap-2">
              <span className="text-slate-500">Sort:</span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-white border border-slate-200 rounded-md py-1 px-2.5 text-xs font-semibold text-slate-800 focus:outline-none"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Product Cards Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                  onOpenDetails={onOpenDetails}
                  isWishlisted={wishlist.includes(product.id)}
                  onToggleWishlist={onToggleWishlist}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <p className="text-base font-bold text-slate-900">
                No materials matched your filter criteria
              </p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Try clearing search terms, selecting "All Categories", or reach out to our sales team directly for custom sourcing.
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors inline-flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          )}
        </main>
      </div>

      {/* MOBILE FILTER DRAWER */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-xs bg-white h-full p-6 space-y-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="font-bold text-slate-900 text-base">Filter Materials</span>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 text-slate-500 hover:text-slate-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Categories */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Category
                </span>
                <div className="space-y-1">
                  {categories.map((cat) => {
                    const isSelected = (cat === 'All Categories' && selectedCategory === 'all') || selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => {
                          onCategoryChange(cat === 'All Categories' ? 'all' : cat);
                          setMobileFilterOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold ${
                          isSelected ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Brands */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Brand
                </span>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full text-xs font-semibold p-2 bg-white border border-slate-200 rounded-lg"
                >
                  <option value="all">All Brands</option>
                  {allBrands.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-200">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-2.5 bg-slate-900 text-white text-xs font-bold rounded-lg shadow-xs"
              >
                Apply Filters ({filteredProducts.length})
              </button>
              <button
                onClick={() => {
                  resetFilters();
                  setMobileFilterOpen(false);
                }}
                className="w-full py-2 text-slate-600 text-xs font-semibold"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
