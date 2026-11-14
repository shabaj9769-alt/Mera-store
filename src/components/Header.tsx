import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  MapPin,
  Heart,
  Package,
  Menu,
  X,
  Shield,
  Home,
  Grid,
  PhoneCall,
  Info,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Header: React.FC = () => {
  const {
    products,
    categories,
    settings,
    cartCount,
    wishlist,
    orders,
  } = useStore();

  const navigate = useNavigate();
  const routeLocation = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const searchRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(routeLocation.search);
    const q = params.get('q');
    if (routeLocation.pathname === '/search' && q !== null) {
      setSearchQuery(q);
    } else if (routeLocation.pathname !== '/search') {
      setSearchQuery('');
    }
    setShowSuggestions(false);
    setShowMobileMenu(false);
  }, [routeLocation.pathname, routeLocation.search]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeProducts = products.filter((p) => p.isActive);
  const trimmedQuery = searchQuery.trim().toLowerCase();

  const matchingProducts = trimmedQuery
    ? activeProducts
        .filter(
          (p) =>
            p.name.toLowerCase().includes(trimmedQuery) ||
            p.brand.toLowerCase().includes(trimmedQuery) ||
            p.categoryName.toLowerCase().includes(trimmedQuery)
        )
        .slice(0, 5)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setShowSuggestions(false);
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <header className="ms-header">
      {/* Top Delivery Strip: Single-line ellipsis delivery area + compact icon badges */}
      <div className="ms-location-strip">
        <div className="ms-container ms-location-inner">
          <div className="ms-location-trigger">
            <MapPin size={13} className="ms-loc-pin-icon" />
            <span className="ms-location-text">
              Delivery: <strong>{settings.deliveryAreaText}</strong>
            </span>
          </div>

          <div className="ms-top-utility-links">
            <Link
              to="/wishlist"
              className="ms-util-icon-btn"
              aria-label={`Wishlist (${wishlist.length})`}
              title="Wishlist"
            >
              <Heart size={15} />
              <span className="ms-util-badge">{wishlist.length}</span>
            </Link>
            <Link
              to="/orders"
              className="ms-util-icon-btn"
              aria-label={`Track Orders (${orders.length})`}
              title="Track Orders"
            >
              <Package size={15} />
              <span className="ms-util-badge">{orders.length}</span>
            </Link>
            <Link
              to="/admin"
              className="ms-util-admin-pill"
              title="Store Owner Admin Panel"
            >
              <Shield size={12} />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="ms-header-main">
        <div className="ms-container ms-header-grid">
          {/* Store Logo: Custom SVG Shopping Bag + Non-italic Store Name + Tagline */}
          <div className="ms-logo-group">
            <button
              type="button"
              className="ms-menu-toggle-btn"
              onClick={() => setShowMobileMenu((v) => !v)}
              aria-label="Toggle Menu"
            >
              {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
            </button>

            <Link to="/" className="ms-logo" aria-label={`${settings.storeName} Home`}>
              <div className="ms-logo-brand-row">
                <svg
                  className="ms-logo-bag-svg"
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M6 7h12l1 13H5L6 7z"
                    fill="#f97316"
                    stroke="#ffffff"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 7V5a3 3 0 0 1 6 0v2"
                    stroke="#ffffff"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="ms-logo-text">{settings.storeName}</span>
              </div>
              <span className="ms-logo-tagline">{settings.productTypeTagline}</span>
            </Link>
          </div>

          {/* Search Bar */}
          <div ref={searchRef} className="ms-search-wrapper">
            <form onSubmit={handleSearchSubmit} className="ms-search-form">
              <Search size={17} className="ms-search-icon" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setShowSuggestions(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                placeholder="Search products..."
                className="ms-search-input"
                aria-label="Search products"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="ms-search-clear"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  <X size={15} />
                </button>
              )}
            </form>

            {showSuggestions && trimmedQuery && (
              <div className="ms-search-dropdown">
                {matchingProducts.length > 0 ? (
                  matchingProducts.map((prod) => (
                    <Link
                      key={prod.id}
                      to={`/product/${prod.id}`}
                      className="ms-suggestion-item"
                      onClick={() => setShowSuggestions(false)}
                    >
                      <Search size={14} color="#6b7280" />
                      <div className="ms-sugg-prod-info">
                        <span className="ms-sugg-title">{prod.name}</span>
                        <span className="ms-sugg-sub">
                          {prod.categoryName} • ₹{prod.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="ms-suggestion-empty">
                    Press Enter to search for &ldquo;{searchQuery}&rdquo;
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Actions: Wishlist Icon, Track Orders, Cart Icon */}
          <div className="ms-header-actions">
            <Link to="/wishlist" className="ms-header-icon-link" aria-label="Wishlist">
              <div className="ms-cart-icon-wrap">
                <Heart size={20} />
                {wishlist.length > 0 && (
                  <span className="ms-cart-badge">{wishlist.length}</span>
                )}
              </div>
              <span className="ms-action-label">Wishlist</span>
            </Link>

            <Link to="/cart" className="ms-cart-link" aria-label="Cart">
              <div className="ms-cart-icon-wrap">
                <ShoppingCart size={20} />
                {cartCount > 0 && <span className="ms-cart-badge">{cartCount}</span>}
              </div>
              <span className="ms-cart-text">Cart</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Clean Store Navigation Menu (Only Home, Categories, Wishlist, Orders, Contact, About) */}
      {showMobileMenu && (
        <nav className="ms-nav-drawer" aria-label="Store Menu">
          <div className="ms-container ms-nav-drawer-inner">
            <Link to="/" className="ms-nav-link" onClick={() => setShowMobileMenu(false)}>
              <Home size={16} />
              <span>Home</span>
            </Link>
            <Link
              to={`/category/${categories[0]?.slug || 'mobiles'}`}
              className="ms-nav-link"
              onClick={() => setShowMobileMenu(false)}
            >
              <Grid size={16} />
              <span>Categories ({categories.length})</span>
            </Link>
            <Link
              to="/wishlist"
              className="ms-nav-link"
              onClick={() => setShowMobileMenu(false)}
            >
              <Heart size={16} />
              <span>Wishlist ({wishlist.length})</span>
            </Link>
            <Link
              to="/orders"
              className="ms-nav-link"
              onClick={() => setShowMobileMenu(false)}
            >
              <Package size={16} />
              <span>Orders (Track Status)</span>
            </Link>
            <a
              href="#store-footer-contact"
              className="ms-nav-link"
              onClick={() => setShowMobileMenu(false)}
            >
              <PhoneCall size={16} />
              <span>Contact</span>
            </a>
            <a
              href="#store-footer-about"
              className="ms-nav-link"
              onClick={() => setShowMobileMenu(false)}
            >
              <Info size={16} />
              <span>About</span>
            </a>
          </div>
        </nav>
      )}
    </header>
  );
};
