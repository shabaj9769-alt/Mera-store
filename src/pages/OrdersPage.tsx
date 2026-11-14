import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Package,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Truck,
  MapPin,
  MessageCircle,
} from 'lucide-react';
import { useStore, Order } from '../context/StoreContext';
import { ProductIllustration } from '../components/ProductIllustration';

export const OrdersPage: React.FC = () => {
  const { orders, settings } = useStore();
  const location = useLocation();

  const [orderIdInput, setOrderIdInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null | 'not-found'>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const oid = params.get('orderId');
    const ph = params.get('phone');
    if (oid && ph) {
      setOrderIdInput(oid);
      setPhoneInput(ph);
      const found = orders.find(
        (o) =>
          o.id.toLowerCase() === oid.trim().toLowerCase() &&
          o.customerPhone.replace(/\D/g, '') === ph.replace(/\D/g, '')
      );
      setSearchedOrder(found || 'not-found');
    }
  }, [location.search, orders]);

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = orderIdInput.trim().toLowerCase();
    const cleanPhone = phoneInput.replace(/\D/g, '');
    const found = orders.find(
      (o) =>
        o.id.toLowerCase() === cleanId &&
        o.customerPhone.replace(/\D/g, '') === cleanPhone
    );
    setSearchedOrder(found || 'not-found');
  };

  const renderStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Placed':
        return (
          <span className="ms-order-status-pill placed">
            <Clock size={14} /> Placed
          </span>
        );
      case 'Confirmed':
        return (
          <span className="ms-order-status-pill confirmed">
            <CheckCircle2 size={14} /> Confirmed
          </span>
        );
      case 'Delivered':
        return (
          <span className="ms-order-status-pill delivered">
            <Truck size={14} /> Delivered
          </span>
        );
      case 'Cancelled':
        return (
          <span className="ms-order-status-pill cancelled">
            <XCircle size={14} /> Cancelled
          </span>
        );
    }
  };

  const buildWhatsAppUrl = (order: Order) => {
    const cleanWa = settings.whatsappNumber.replace(/\D/g, '');
    const text = `Namaste ${settings.storeName}, mera Order ID *${order.id}* (Phone: ${order.customerPhone}, Total: ₹${order.finalAmount}) ka status kya hai?`;
    return `https://wa.me/${cleanWa}?text=${encodeURIComponent(text)}`;
  };

  const renderOrderCard = (order: Order) => (
    <div key={order.id} className="ms-order-card">
      <div className="ms-order-card-head">
        <div className="ms-order-meta-left">
          <span className="ms-order-id-pill">Order #{order.id}</span>
          <span className="ms-order-date">{order.createdAt}</span>
        </div>
        {renderStatusBadge(order.status)}
      </div>

      <div className="ms-order-items-list">
        {order.items.map((item) => (
          <div key={item.productId} className="ms-order-item-row">
            <Link to={`/product/${item.productId}`} className="ms-order-item-thumb">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.name} className="ms-card-uploaded-img" />
              ) : (
                <ProductIllustration
                  type={item.illustrationType}
                  gradientFrom={item.gradientFrom}
                  gradientTo={item.gradientTo}
                  accentColor={item.accentColor}
                />
              )}
            </Link>
            <div className="ms-order-item-info">
              <Link to={`/product/${item.productId}`} className="ms-order-item-name">
                {item.name}
              </Link>
              <span className="ms-order-item-sub">Qty: {item.quantity}</span>
              <span className="ms-order-item-price">
                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="ms-order-card-foot">
        <div className="ms-order-delivery-loc">
          <MapPin size={14} color="#6b7280" />
          <span>
            {order.customerName} ({order.customerPhone}) — {order.customerAddress},{' '}
            {order.pincode}
          </span>
        </div>
        <div className="ms-order-foot-right">
          <a
            href={buildWhatsAppUrl(order)}
            target="_blank"
            rel="noopener noreferrer"
            className="ms-wa-mini-btn"
          >
            <MessageCircle size={14} />
            <span>WhatsApp</span>
          </a>
          <div className="ms-order-total-box">
            <span>COD Total:</span>
            <strong>₹{order.finalAmount.toLocaleString('en-IN')}</strong>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="ms-page-orders">
      <div className="ms-container ms-section-pad">
        <h1 className="ms-page-heading">Track Your Order Status</h1>

        {/* Order ID + Phone Lookup Box (No Login Needed) */}
        <div className="ms-order-lookup-card">
          <p className="ms-lookup-desc">
            Enter your <strong>Order ID</strong> and <strong>10-digit Phone Number</strong> to check
            live order status (Placed / Confirmed / Delivered / Cancelled). No login required!
          </p>
          <form onSubmit={handleTrackOrder} className="ms-lookup-form">
            <input
              type="text"
              value={orderIdInput}
              onChange={(e) => setOrderIdInput(e.target.value)}
              placeholder="Order ID (e.g. ORD-1042)"
              className="ms-text-input"
              required
            />
            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, ''))}
              placeholder="10-Digit Phone (e.g. 9876543210)"
              className="ms-text-input"
              required
            />
            <button type="submit" className="ms-primary-btn">
              <Search size={16} />
              <span>Check Status</span>
            </button>
          </form>

          {searchedOrder === 'not-found' && (
            <div className="ms-lookup-not-found">
              No order found matching Order ID <strong>{orderIdInput}</strong> and Phone{' '}
              <strong>{phoneInput}</strong>. Try demo order: <code>ORD-1042</code> &amp;{' '}
              <code>9876543210</code>.
            </div>
          )}

          {searchedOrder && searchedOrder !== 'not-found' && (
            <div className="ms-lookup-result-wrap">
              <h3 className="ms-lookup-res-title">Matching Order Found:</h3>
              {renderOrderCard(searchedOrder)}
            </div>
          )}
        </div>

        {/* Recent Orders on this device */}
        <div className="ms-recent-orders-sec">
          <h2 className="ms-saved-heading">Recent Orders on This Device ({orders.length})</h2>
          {orders.length === 0 ? (
            <div className="ms-empty-box">
              <Package size={44} color="#4338ca" />
              <h3>No Orders Yet</h3>
              <Link to="/" className="ms-primary-btn">
                Browse Store
              </Link>
            </div>
          ) : (
            <div className="ms-orders-stack">
              {orders.map((order) => renderOrderCard(order))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
