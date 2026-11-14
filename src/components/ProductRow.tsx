import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Product } from '../data/products';
import { ProductCard, SkeletonProductCard } from './ProductCard';

interface ProductRowProps {
  id: string;
  title: string;
  subtitle: string;
  badgeText?: string;
  accentBg?: string;
  products: Product[];
  isLoading?: boolean;
  viewAllLink: string;
}

export const ProductRow: React.FC<ProductRowProps> = ({
  id,
  title,
  subtitle,
  badgeText,
  accentBg = '#ffffff',
  products,
  isLoading = false,
  viewAllLink,
}) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const offset = dir === 'left' ? -360 : 360;
    scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  return (
    <section id={id} className="ms-product-row-section">
      <div className="ms-container">
        <div className="ms-row-card" style={{ backgroundColor: accentBg }}>
          <div className="ms-row-header">
            <div className="ms-row-title-group">
              <div className="ms-row-title-line">
                <h2 className="ms-row-title">{title}</h2>
                {badgeText && <span className="ms-row-rule-badge">{badgeText}</span>}
              </div>
              <p className="ms-row-subtitle">{subtitle}</p>
            </div>

            <div className="ms-row-actions">
              <div className="ms-row-desktop-arrows">
                <button
                  type="button"
                  className="ms-row-scroll-btn"
                  onClick={() => handleScroll('left')}
                  aria-label={`Scroll ${title} left`}
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  className="ms-row-scroll-btn"
                  onClick={() => handleScroll('right')}
                  aria-label={`Scroll ${title} right`}
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              <Link to={viewAllLink} className="ms-view-all-btn" aria-label={`View all in ${title}`}>
                <span>View All</span>
                <ChevronRight size={15} />
              </Link>
            </div>
          </div>

          <div ref={scrollRef} className="ms-horizontal-scroll-track">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="ms-row-item-slot">
                    <SkeletonProductCard compact />
                  </div>
                ))
              : products.map((product) => (
                  <div key={product.id} className="ms-row-item-slot">
                    <ProductCard product={product} compact />
                  </div>
                ))}
          </div>
        </div>
      </div>
    </section>
  );
};
