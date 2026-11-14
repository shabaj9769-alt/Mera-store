import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductIllustration } from './ProductIllustration';

export const HeroCarousel: React.FC = () => {
  const { banners } = useStore();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const safeBanners = banners.length > 0 ? banners : [];

  useEffect(() => {
    if (activeIndex >= safeBanners.length) {
      setActiveIndex(0);
    }
  }, [safeBanners.length, activeIndex]);

  useEffect(() => {
    if (isPaused || safeBanners.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % safeBanners.length);
    }, 3800);
    return () => window.clearInterval(timer);
  }, [isPaused, safeBanners.length]);

  if (safeBanners.length === 0) return null;

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + safeBanners.length) % safeBanners.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % safeBanners.length);
  };

  const currentSlide = safeBanners[activeIndex] || safeBanners[0];

  return (
    <section
      className="ms-hero-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Store Banners"
    >
      <div className="ms-container">
        <div
          className="ms-hero-carousel-box"
          style={{ background: currentSlide.gradient || 'linear-gradient(135deg, #312e81, #4338ca)' }}
        >
          {safeBanners.length > 1 && (
            <button
              type="button"
              className="ms-carousel-arrow ms-arrow-left"
              onClick={handlePrev}
              aria-label="Previous slide"
            >
              <ChevronLeft size={20} />
            </button>
          )}

          <div className="ms-hero-slide-content">
            <div className="ms-hero-text-col">
              {currentSlide.tag && <span className="ms-hero-tag">{currentSlide.tag}</span>}
              <h2 className="ms-hero-title">{currentSlide.title}</h2>
              <p className="ms-hero-subtitle">{currentSlide.subtitle}</p>
              <div className="ms-hero-cta-row">
                {currentSlide.priceTag && (
                  <span className="ms-hero-price-badge">{currentSlide.priceTag}</span>
                )}
                <Link to={currentSlide.targetLink || '/'} className="ms-hero-cta-btn">
                  <span>{currentSlide.ctaText || 'Shop Now'}</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>

            <div className="ms-hero-visual-col">
              <div className="ms-hero-illus-frame">
                {currentSlide.imageUrl ? (
                  <img
                    src={currentSlide.imageUrl}
                    alt={currentSlide.title}
                    className="ms-hero-custom-img"
                  />
                ) : (
                  <ProductIllustration
                    type={currentSlide.illustration || 'smartphone'}
                    gradientFrom="#ffffff"
                    gradientTo="#e0e7ff"
                    accentColor="#4338ca"
                  />
                )}
              </div>
            </div>
          </div>

          {safeBanners.length > 1 && (
            <button
              type="button"
              className="ms-carousel-arrow ms-arrow-right"
              onClick={handleNext}
              aria-label="Next slide"
            >
              <ChevronRight size={20} />
            </button>
          )}
        </div>

        {/* Pill Indicators */}
        {safeBanners.length > 1 && (
          <div className="ms-carousel-dots" role="tablist">
            {safeBanners.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-selected={idx === activeIndex}
                aria-label={`Slide ${idx + 1}: ${slide.title}`}
                className={`ms-dot-btn ${idx === activeIndex ? 'active' : ''}`}
                onClick={() => setActiveIndex(idx)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
