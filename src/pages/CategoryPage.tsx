import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowUpDown, ChevronRight } from 'lucide-react';
import { CategoryStrip } from '../components/CategoryStrip';
import { ProductCard, SkeletonProductCard } from '../components/ProductCard';
import { useStore } from '../context/StoreContext';

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'discount';

export const CategoryPage: React.FC = () => {
  const { slug = 'mobiles' } = useParams<{ slug: string }>();
  const { products, categories, settings } = useStore();
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const t = window.setTimeout(() => setIsLoading(false), 240);
    return () => window.clearTimeout(t);
  }, [slug]);

  const categoryInfo = categories.find((c) => c.slug === slug);

  const filteredProducts = useMemo(() => {
    const active = products.filter((p) => p.isActive);
    const list =
      slug === 'all'
        ? [...active]
        : active.filter((p) => p.categorySlug === slug);

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
        list.sort((a, b) => b.createdAt - a.createdAt);
        break;
    }
    return list;
  }, [products, slug, sortBy]);

  return (
    <div className="ms-page-category">
      <CategoryStrip />

      <div className="ms-container ms-section-pad">
        {/* Breadcrumb */}
        <div className="ms-breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight size={13} className="ms-bc-sep" />
          <span>{categoryInfo ? categoryInfo.name : slug}</span>
        </div>

        {/* Category Banner Header */}
        <div className="ms-cat-header-box">
          <div>
            <h1 className="ms-cat-title">
              {categoryInfo ? `${categoryInfo.emoji} ${categoryInfo.name}` : 'Category'}
            </h1>
            <p className="ms-cat-subtitle">
              {filteredProducts.length} products available at {settings.storeName}
            </p>
          </div>
        </div>

        {/* Sort Bar */}
        <div className="ms-filter-bar">
          <div className="ms-sort-group">
            <ArrowUpDown size={15} color="#4338ca" />
            <span className="ms-filter-label">Sort By:</span>
            <div className="ms-sort-pills">
              {[
                { key: 'newest', label: 'Newest First' },
                { key: 'price-asc', label: 'Price: Low to High' },
                { key: 'price-desc', label: 'Price: High to Low' },
                { key: 'discount', label: 'Discount %' },
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

        {/* Product Grid */}
        {isLoading ? (
          <div className="ms-products-grid">
            {Array.from({ length: 6 }).map((_, idx) => (
              <SkeletonProductCard key={idx} />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="ms-products-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="ms-empty-box">
            <h3>No products in this category yet</h3>
            <p>Check back soon or browse all available items on our home page.</p>
            <Link to="/" className="ms-primary-btn">
              Back to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
