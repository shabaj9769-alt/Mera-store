import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import { Product } from '../data/products';
import { useStore } from '../context/StoreContext';
import { ProductIllustration } from './ProductIllustration';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export const SkeletonProductCard: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  return (
    <div className={`ms-product-card ms-skeleton-card ${compact ? 'ms-card-compact' : ''}`} aria-hidden="true">
      <div className="ms-skeleton-img ms-shimmer" />
      <div className="ms-card-body">
        <div className="ms-skeleton-line ms-skeleton-w85 ms-shimmer" />
        <div className="ms-skeleton-line ms-skeleton-w60 ms-shimmer" />
        <div className="ms-skeleton-pill ms-shimmer" />
        <div className="ms-skeleton-price ms-shimmer" />
      </div>
    </div>
  );
};

export const ProductCard: React.FC<ProductCardProps> = ({ product, compact = false }) => {
  const { toggleWishlist, isInWishlist } = useStore();
  const wishlisted = isInWishlist(product.id);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) {
      setIsVisible(true);
      return;
    }
    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '140px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleHeartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const outOfStock = product.stock <= 0;
  const primaryImage = product.images && product.images.length > 0 ? product.images[0] : null;

  return (
    <div
      ref={cardRef}
      className={`ms-product-card ${compact ? 'ms-card-compact' : ''} ${
        outOfStock ? 'ms-card-oos' : ''
      }`}
    >
      <button
        type="button"
        onClick={handleHeartClick}
        className={`ms-wishlist-btn ${wishlisted ? 'active' : ''}`}
        aria-label={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
      >
        <Heart
          size={16}
          fill={wishlisted ? '#ef4444' : 'none'}
          stroke={wishlisted ? '#ef4444' : '#6b7280'}
        />
      </button>

      {outOfStock ? (
        <span className="ms-card-status-badge oos">Out of stock</span>
      ) : product.isBestSeller ? (
        <span className="ms-card-status-badge bestseller">
          <Star size={10} fill="#ffffff" stroke="#ffffff" /> Best Seller
        </span>
      ) : null}

      <Link to={`/product/${product.id}`} className="ms-card-link">
        <div className="ms-card-image-wrap">
          {isVisible ? (
            primaryImage ? (
              <img
                src={primaryImage}
                alt={product.name}
                className="ms-card-uploaded-img"
                loading="lazy"
              />
            ) : (
              <ProductIllustration
                type={product.illustrationType}
                gradientFrom={product.gradientFrom}
                gradientTo={product.gradientTo}
                accentColor={product.accentColor}
              />
            )
          ) : (
            <div className="ms-skeleton-img ms-shimmer" />
          )}
        </div>

        <div className="ms-card-body">
          <div className="ms-card-brand-row">
            <span className="ms-card-brand">{product.categoryName}</span>
          </div>

          <h3 className="ms-card-title" title={product.name}>
            {product.name}
          </h3>

          <div className="ms-price-row">
            <span className="ms-price-current">₹{product.price.toLocaleString('en-IN')}</span>
            {product.mrp > product.price && (
              <>
                <span className="ms-price-mrp">₹{product.mrp.toLocaleString('en-IN')}</span>
                <span className="ms-price-discount">{product.discount}% off</span>
              </>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};
