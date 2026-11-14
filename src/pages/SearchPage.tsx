import React, { useState, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Search, ArrowUpDown, ChevronRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';

type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'discount';

export const SearchPage: React.FC = () => {
  const { products, settings } = useStore();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const rawQuery = params.get('q') || '';
  const query = rawQuery.trim().toLowerCase();

  const [sortBy, setSortBy] = useState<SortOption>('relevance');

  const results = useMemo(() => {
    let list = products.filter((p) => p.isActive);

    if (query) {
      if (query === 'bestseller' || query === 'best sellers') {
        list = list.filter((p) => p.isBestSeller);
      } else if (query === 'offers' || query === 'offer') {
        list = list.filter((p) => p.discount >= 20);
      } else if (query === 'new') {
        list.sort((a, b) => b.createdAt - a.createdAt);
      } else {
        const words = query.split(/\s+/).filter(Boolean);
        list = list.filter((p) => {
          const haystack = `${p.name} ${p.brand} ${p.categoryName} ${p.description}`.toLowerCase();
          return words.some((w) => haystack.includes(w));
        });
      }
    }

    switch (sortBy) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'discount':
        list.sort((a, b) => b.discount - a.discount);
        break;
      default:
        break;
    }

    return list;
  }, [products, query, sortBy]);

  return (
    <div className="ms-page-search">
      <div className="ms-container ms-section-pad">
        <div className="ms-breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight size={13} className="ms-bc-sep" />
          <span>Search Results</span>
        </div>

        <div className="ms-search-header-box">
          <div className="ms-search-head-left">
            <Search size={18} color="#4338ca" />
            <div>
              <h1 className="ms-search-title">
                {rawQuery ? (
                  <>
                    Results for <span>&ldquo;{rawQuery}&rdquo;</span>
                  </>
                ) : (
                  `All Products at ${settings.storeName}`
                )}
              </h1>
              <p className="ms-search-count">{results.length} items found</p>
            </div>
          </div>

          <div className="ms-sort-group">
            <ArrowUpDown size={14} color="#4338ca" />
            <div className="ms-sort-pills">
              {[
                { key: 'relevance', label: 'Relevance' },
                { key: 'price-asc', label: 'Price: Low to High' },
                { key: 'price-desc', label: 'Price: High to Low' },
                { key: 'discount', label: 'Discount' },
              ].map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  className={`ms-sort-pill ${sortBy === opt.key ? 'active' : ''}`}
                  onClick={() => setSortBy(opt.key as SortOption)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {results.length > 0 ? (
          <div className="ms-products-grid">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="ms-empty-box">
            <h3>No products found for &ldquo;{rawQuery}&rdquo;</h3>
            <p>Try searching with another product name or browse our store categories.</p>
            <Link to="/" className="ms-primary-btn">
              Browse All Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
