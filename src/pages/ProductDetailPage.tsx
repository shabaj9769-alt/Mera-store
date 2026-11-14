import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  Star,
  Truck,
  ShieldCheck,
  ShoppingCart,
  Zap,
  ChevronRight,
  Plus,
  Minus,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductIllustration } from '../components/ProductIllustration';
import { ProductRow } from '../components/ProductRow';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    products,
    settings,
    getProductById,
    addToCart,
    toggleWishlist,
    isInWishlist,
  } = useStore();

  const product = id ? getProductById(id) : undefined;
  const [selectedAngle, setSelectedAngle] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedAngle(0);
    setQuantity(1);
  }, [id]);

  if (!product) {
    return (
      <div className="ms-container ms-section-pad">
        <div className="ms-empty-box">
          <h2>Product Not Found</h2>
          <p>The product you are looking for does not exist or has been removed.</p>
          <Link to="/" className="ms-primary-btn">
            Back to {settings.storeName}
          </Link>
        </div>
      </div>
    );
  }

  const wishlisted = isInWishlist(product.id);
  const outOfStock = product.stock <= 0;
  const hasCustomImages = product.images && product.images.length > 0;
  const gallerySlots = hasCustomImages ? product.images : ['angle-0', 'angle-1', 'angle-2'];
  const angleLabels = ['Front View', 'Side View', 'Detail View'];

  const handleAddToCart = () => {
    if (outOfStock) return;
    addToCart(product.id, quantity);
  };

  const handleBuyNow = () => {
    if (outOfStock) return;
    addToCart(product.id, quantity);
    navigate('/cart');
  };

  const similarProducts = products
    .filter((p) => p.isActive && p.categorySlug === product.categorySlug && p.id !== product.id)
    .concat(
      products.filter((p) => p.isActive && p.categorySlug !== product.categorySlug).slice(0, 6)
    );

  return (
    <div className="ms-page-pdp">
      <div className="ms-container ms-section-pad">
        {/* Breadcrumb (Single line, horizontal scroll) */}
        <div className="ms-breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight size={13} className="ms-bc-sep" />
          <Link to={`/category/${product.categorySlug}`}>{product.categoryName}</Link>
          <ChevronRight size={13} className="ms-bc-sep" />
          <span>{product.name}</span>
        </div>

        <div className="ms-pdp-layout">
          {/* Left Column: Gallery Card (100% width, Heart inside card) */}
          <div className="ms-pdp-gallery-col">
            <div className="ms-pdp-gallery-card">
              <div className="ms-pdp-main-visual">
                <button
                  type="button"
                  className={`ms-wishlist-btn ms-pdp-wishlist ${wishlisted ? 'active' : ''}`}
                  onClick={() => toggleWishlist(product.id)}
                  aria-label="Toggle Wishlist"
                >
                  <Heart
                    size={18}
                    fill={wishlisted ? '#ef4444' : 'none'}
                    stroke={wishlisted ? '#ef4444' : '#6b7280'}
                  />
                </button>

                {hasCustomImages ? (
                  <img
                    src={product.images[selectedAngle] || product.images[0]}
                    alt={product.name}
                    className="ms-pdp-uploaded-img"
                  />
                ) : (
                  <ProductIllustration
                    type={product.illustrationType}
                    gradientFrom={product.gradientFrom}
                    gradientTo={product.gradientTo}
                    accentColor={product.accentColor}
                    angle={selectedAngle}
                  />
                )}
              </div>

              {/* Thumbnail Switcher */}
              <div className="ms-pdp-thumbs">
                {gallerySlots.slice(0, 4).map((slot, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`ms-pdp-thumb-btn ${selectedAngle === idx ? 'active' : ''}`}
                    onClick={() => setSelectedAngle(idx)}
                  >
                    <div className="ms-pdp-thumb-visual">
                      {hasCustomImages ? (
                        <img
                          src={slot}
                          alt={`${product.name} view ${idx + 1}`}
                          className="ms-pdp-uploaded-img"
                        />
                      ) : (
                        <ProductIllustration
                          type={product.illustrationType}
                          gradientFrom={product.gradientFrom}
                          gradientTo={product.gradientTo}
                          accentColor={product.accentColor}
                          angle={idx}
                        />
                      )}
                    </div>
                    <span className="ms-thumb-caption">
                      {hasCustomImages ? `Photo ${idx + 1}` : angleLabels[idx] || `View ${idx + 1}`}
                    </span>
                  </button>
                ))}
              </div>

              {/* Desktop Add to Cart / Buy Now */}
              <div className="ms-pdp-desktop-ctas">
                <button
                  type="button"
                  className="ms-cta-add-cart"
                  disabled={outOfStock}
                  onClick={handleAddToCart}
                >
                  <ShoppingCart size={18} />
                  <span>{outOfStock ? 'OUT OF STOCK' : 'ADD TO CART'}</span>
                </button>
                <button
                  type="button"
                  className="ms-cta-buy-now"
                  disabled={outOfStock}
                  onClick={handleBuyNow}
                >
                  <Zap size={18} />
                  <span>BUY NOW</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Product Info, Stock Status, Quantity, Description, Specs */}
          <div className="ms-pdp-details-col">
            <div className="ms-pdp-info-card">
              <div className="ms-pdp-brand-line">
                <span className="ms-pdp-brand">{product.categoryName}</span>
                {product.isBestSeller && (
                  <span className="ms-assured-tag">
                    <Star size={11} fill="#4338ca" stroke="#4338ca" /> Best Seller
                  </span>
                )}
              </div>

              <h1 className="ms-pdp-title">{product.name}</h1>

              {/* Price / MRP / % Off */}
              <div className="ms-pdp-price-block">
                <span className="ms-pdp-price">₹{product.price.toLocaleString('en-IN')}</span>
                {product.mrp > product.price && (
                  <>
                    <span className="ms-pdp-mrp">₹{product.mrp.toLocaleString('en-IN')}</span>
                    <span className="ms-pdp-discount">{product.discount}% off</span>
                  </>
                )}
              </div>

              {/* Stock Status & Quantity Selector */}
              <div className="ms-pdp-stock-row">
                {outOfStock ? (
                  <div className="ms-stock-pill oos">
                    <AlertCircle size={15} />
                    <span>Out of Stock</span>
                  </div>
                ) : (
                  <div className="ms-stock-pill instock">
                    <CheckCircle2 size={15} />
                    <span>In Stock ({product.stock} units available)</span>
                  </div>
                )}

                {!outOfStock && (
                  <div className="ms-pdp-qty-box">
                    <span className="ms-qty-label">Quantity:</span>
                    <div className="ms-qty-stepper">
                      <button
                        type="button"
                        className="ms-qty-btn"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="ms-qty-value">{quantity}</span>
                      <button
                        type="button"
                        className="ms-qty-btn"
                        onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                        disabled={quantity >= product.stock}
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Delivery Info from Admin Settings */}
              <div className="ms-pdp-section">
                <h3 className="ms-pdp-sec-title">Store Delivery &amp; Payment</h3>
                <div className="ms-pdp-service-badges">
                  <div className="ms-service-mini">
                    <Truck size={16} color="#4338ca" />
                    <span>
                      Delivery: {settings.deliveryAreaText} (Free above ₹
                      {settings.freeDeliveryAmount}, else ₹{settings.deliveryFee})
                    </span>
                  </div>
                  <div className="ms-service-mini">
                    <ShieldCheck size={16} color="#15803d" />
                    <span>Cash on Delivery (COD) Available</span>
                  </div>
                </div>
              </div>

              {/* Product Description */}
              <div className="ms-pdp-section">
                <h3 className="ms-pdp-sec-title">Description</h3>
                <p className="ms-pdp-desc-text">{product.description}</p>
              </div>

              {/* Specifications Table */}
              {Object.keys(product.specs).length > 0 && (
                <div className="ms-pdp-section">
                  <h3 className="ms-pdp-sec-title">Specifications</h3>
                  <table className="ms-specs-table">
                    <tbody>
                      {Object.entries(product.specs).map(([key, val]) => (
                        <tr key={key}>
                          <th>{key.replace(/_/g, ' ')}</th>
                          <td>{val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Similar Products Row */}
      <ProductRow
        id="similar-products"
        title="More from our Store"
        subtitle="You might also like these items"
        products={similarProducts.slice(0, 8)}
        viewAllLink={`/category/${product.categorySlug}`}
      />

      {/* Sticky Mobile Bottom Bar (Uses --bar-h variable) */}
      <div className="ms-pdp-sticky-bar">
        <button
          type="button"
          className="ms-sticky-cart-btn"
          disabled={outOfStock}
          onClick={handleAddToCart}
        >
          <ShoppingCart size={18} />
          <span>{outOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
        </button>
        <button
          type="button"
          className="ms-sticky-buy-btn"
          disabled={outOfStock}
          onClick={handleBuyNow}
        >
          <Zap size={18} />
          <span>Buy Now</span>
        </button>
      </div>
    </div>
  );
};
