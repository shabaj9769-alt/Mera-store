import React, { useState, useEffect } from 'react';
import { CategoryStrip } from '../components/CategoryStrip';
import { HeroCarousel } from '../components/HeroCarousel';
import { ProductRow } from '../components/ProductRow';
import { useStore } from '../context/StoreContext';

export const HomePage: React.FC = () => {
  const { products } = useStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsLoading(false);
    }, 280);
    return () => window.clearTimeout(timer);
  }, []);

  const activeProducts = products.filter((p) => p.isActive);

  // 1) Naye Products (sorted by newest createdAt)
  const nayeProducts = [...activeProducts].sort((a, b) => b.createdAt - a.createdAt);

  // 2) Best Sellers (admin star toggle)
  const bestSellers = activeProducts.filter((p) => p.isBestSeller);

  // 3) Offers (discount >= 20%)
  const offerProducts = activeProducts.filter((p) => p.discount >= 20);

  return (
    <div className="ms-page-home">
      {/* 1. Horizontal Scrollable Category Chips */}
      <CategoryStrip />

      {/* 2. Store Hero Banner Carousel (Managed from Admin) */}
      <HeroCarousel />

      {/* 3. Store Sections: Naye Products, Best Sellers, Offers */}
      <div className="ms-home-rows-stack">
        <ProductRow
          id="naye-products"
          title="Naye Products"
          subtitle="Fresh arrivals added to our store"
          badgeText="NEW"
          accentBg="#ffffff"
          products={nayeProducts}
          isLoading={isLoading}
          viewAllLink="/search?q=new"
        />

        <ProductRow
          id="best-sellers"
          title="Best Sellers"
          subtitle="Most popular customer favorites ★"
          badgeText="★ TOP PICKS"
          accentBg="#ffffff"
          products={bestSellers.length > 0 ? bestSellers : activeProducts.slice(0, 6)}
          isLoading={isLoading}
          viewAllLink="/search?q=bestseller"
        />

        <ProductRow
          id="offers-section"
          title="Offers"
          subtitle="Special store discounts (Min. 20% Off)"
          badgeText="20%+ OFF"
          accentBg="#ffffff"
          products={offerProducts}
          isLoading={isLoading}
          viewAllLink="/search?q=offers"
        />
      </div>
    </div>
  );
};
