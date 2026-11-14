import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, MessageCircle, Shield } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const { settings, categories } = useStore();

  const cleanWhatsApp = settings.whatsappNumber.replace(/\D/g, '');

  return (
    <footer className="ms-footer">
      {/* Main Dark Footer: Single-Store Info, Menu Links & Contact */}
      <div className="ms-footer-dark">
        <div className="ms-container">
          <div className="ms-footer-columns">
            {/* Store About */}
            <div id="store-footer-about" className="ms-footer-col">
              <h5>ABOUT {settings.storeName.toUpperCase()}</h5>
              <p className="ms-footer-about-text">
                <strong>{settings.storeName}</strong> — {settings.productTypeTagline}. Direct
                single-store online shop offering genuine products, transparent pricing, and
                doorstep Cash on Delivery.
              </p>
              <p className="ms-footer-delivery-note">
                Delivery Area: <strong>{settings.deliveryAreaText}</strong> (Free delivery above ₹
                {settings.freeDeliveryAmount})
              </p>
            </div>

            {/* Store Menu (Strictly Home, Categories, Wishlist, Orders, Contact, About) */}
            <div className="ms-footer-col">
              <h5>STORE MENU</h5>
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to={`/category/${categories[0]?.slug || 'mobiles'}`}>Categories</Link>
                </li>
                <li>
                  <Link to="/wishlist">Wishlist</Link>
                </li>
                <li>
                  <Link to="/orders">Track Orders</Link>
                </li>
                <li>
                  <a href="#store-footer-contact">Contact</a>
                </li>
                <li>
                  <a href="#store-footer-about">About</a>
                </li>
                <li>
                  <Link to="/admin" className="ms-footer-admin-link">
                    <Shield size={12} /> Store Owner Admin
                  </Link>
                </li>
              </ul>
            </div>

            {/* Store Categories */}
            <div className="ms-footer-col">
              <h5>CATEGORIES</h5>
              <ul>
                {categories.slice(0, 6).map((cat) => (
                  <li key={cat.slug}>
                    <Link to={`/category/${cat.slug}`}>
                      {cat.emoji} {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Store Address, Phone, WhatsApp, Timing */}
            <div id="store-footer-contact" className="ms-footer-col ms-footer-address">
              <h5>STORE ADDRESS &amp; TIMING</h5>
              <div className="ms-footer-contact-list">
                <div className="ms-footer-contact-item">
                  <MapPin size={15} color="#f97316" />
                  <span>{settings.storeAddress}</span>
                </div>
                <div className="ms-footer-contact-item">
                  <Phone size={15} color="#f97316" />
                  <span>Phone: {settings.phoneNumber}</span>
                </div>
                <div className="ms-footer-contact-item">
                  <MessageCircle size={15} color="#22c55e" />
                  <a
                    href={`https://wa.me/${cleanWhatsApp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ms-footer-wa-link"
                  >
                    WhatsApp: +{cleanWhatsApp}
                  </a>
                </div>
                <div className="ms-footer-contact-item">
                  <Clock size={15} color="#f97316" />
                  <span>{settings.storeTiming}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="ms-footer-bottom">
            <span>
              © 2026 {settings.storeName}. Demo project, kisi aur company se related nahi.
            </span>
            <div className="ms-footer-bottom-links">
              <Link to="/">Home</Link>
              <Link to="/cart">Cart</Link>
              <Link to="/wishlist">Wishlist</Link>
              <Link to="/orders">Orders</Link>
              <Link to="/admin">Admin</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
