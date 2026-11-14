import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductIllustration } from '../components/ProductIllustration';

export const WishlistPage: React.FC = () => {
  const { wishlist, getProductById, toggleWishlist, addToCart } = useStore();

  const wishlistedProducts = wishlist
    .map((id) => getProductById(id))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  return (
    <div className="ms-page-wishlist">
      <div className="ms-container ms-section-pad">
        <h1 className="ms-page-heading">My Wishlist ({wishlistedProducts.length})</h1>

        {wishlistedProducts.length === 0 ? (
          <div className="ms-empty-box">
            <Heart size={46} color="#ef4444" />
            <h2>Your Wishlist is Empty</h2>
            <p>Tap the heart icon on any product to save it here for later.</p>
            <Link to="/" className="ms-primary-btn">
              Explore Store
            </Link>
          </div>
        ) : (
          <div className="ms-wishlist-grid">
            {wishlistedProducts.map((product) => {
              const outOfStock = product.stock <= 0;
              return (
                <div key={product.id} className="ms-wishlist-card">
                  <Link to={`/product/${product.id}`} className="ms-wishlist-thumb">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="ms-card-uploaded-img"
                      />
                    ) : (
                      <ProductIllustration
                        type={product.illustrationType}
                        gradientFrom={product.gradientFrom}
                        gradientTo={product.gradientTo}
                        accentColor={product.accentColor}
                      />
                    )}
                  </Link>

                  <div className="ms-wishlist-info">
                    <span className="ms-card-brand">{product.categoryName}</span>
                    <Link to={`/product/${product.id}`} className="ms-wishlist-title">
                      {product.name}
                    </Link>

                    <div className="ms-price-row">
                      <span className="ms-price-current">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      {product.mrp > product.price && (
                        <>
                          <span className="ms-price-mrp">
                            ₹{product.mrp.toLocaleString('en-IN')}
                          </span>
                          <span className="ms-price-discount">{product.discount}% off</span>
                        </>
                      )}
                    </div>

                    <div className="ms-wishlist-actions">
                      <button
                        type="button"
                        className="ms-move-cart-btn"
                        disabled={outOfStock}
                        onClick={() => {
                          addToCart(product.id, 1);
                          toggleWishlist(product.id);
                        }}
                      >
                        <ShoppingCart size={15} />
                        <span>{outOfStock ? 'Out of Stock' : 'Move to Cart'}</span>
                      </button>
                      <button
                        type="button"
                        className="ms-wish-remove-btn"
                        onClick={() => toggleWishlist(product.id)}
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
