import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Minus,
  Trash2,
  ShieldCheck,
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  MessageCircle,
  Package,
} from 'lucide-react';
import { useStore, Order } from '../context/StoreContext';
import { ProductIllustration } from '../components/ProductIllustration';

export const CartPage: React.FC = () => {
  const {
    cart,
    settings,
    getProductById,
    updateCartQty,
    removeFromCart,
    placeOrder,
  } = useStore();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [orderType, setOrderType] = useState<'Daily' | 'Advance'>('Daily');
  const [formError, setFormError] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const populatedCart = cart
    .map((item) => {
      const product = getProductById(item.productId);
      return product ? { product, quantity: item.quantity } : null;
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  const totalItems = populatedCart.reduce((acc, i) => acc + i.quantity, 0);
  const totalMrp = populatedCart.reduce((acc, i) => acc + i.product.mrp * i.quantity, 0);
  const subtotal = populatedCart.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
  const totalDiscount = Math.max(0, totalMrp - subtotal);
  const deliveryFee =
    subtotal === 0 ? 0 : subtotal >= settings.freeDeliveryAmount ? 0 : settings.deliveryFee;
  const finalAmount = subtotal + deliveryFee;
  const amountNeededForFreeDelivery = Math.max(0, settings.freeDeliveryAmount - subtotal);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setFormError('Please enter your full name.');
      return;
    }
    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setFormError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!customerAddress.trim() || customerAddress.trim().length < 6) {
      setFormError('Please enter your complete delivery address.');
      return;
    }
    const cleanPin = pincode.trim();
    if (!/^[1-9][0-9]{5}$/.test(cleanPin)) {
      setFormError('Please enter a valid 6-digit pincode.');
      return;
    }

    // Check serviceable pincodes if configured in Admin Settings
    const allowedPins = settings.serviceablePincodes
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (allowedPins.length > 0 && !allowedPins.includes(cleanPin)) {
      setFormError(
        `Sorry, delivery is currently available for pincodes: ${allowedPins.join(', ')}`
      );
      return;
    }

    setFormError('');
    const created = placeOrder({
      customerName,
      customerPhone: cleanPhone,
      customerAddress,
      pincode: cleanPin,
      orderType,
    });
    if (created) {
      setConfirmedOrder(created);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const buildWhatsAppUrl = (order: Order) => {
    const cleanWa = settings.whatsappNumber.replace(/\D/g, '');
    const itemsLines = order.items
      .map((it) => `• ${it.name} (x${it.quantity}) - ₹${it.price * it.quantity}`)
      .join('\n');
    const text = [
      `Namaste *${settings.storeName}*! Maine abhi order place kiya hai:`,
      ``,
      `*Order ID:* ${order.id}`,
      `*Name:* ${order.customerName}`,
      `*Phone:* ${order.customerPhone}`,
      `*Address:* ${order.customerAddress}, Pincode: ${order.pincode}`,
      `*Order Type:* ${order.orderType}`,
      ``,
      `*Items:*`,
      itemsLines,
      ``,
      `*Total Amount (COD):* ₹${order.finalAmount.toLocaleString('en-IN')}`,
    ].join('\n');
    return `https://wa.me/${cleanWa}?text=${encodeURIComponent(text)}`;
  };

  // Order Confirmation Screen
  if (confirmedOrder) {
    return (
      <div className="ms-page-cart">
        <div className="ms-container ms-section-pad">
          <div className="ms-order-confirm-card">
            <div className="ms-confirm-icon-circle">
              <CheckCircle2 size={42} color="#15803d" />
            </div>
            <span className="ms-confirm-tag">ORDER CONFIRMED</span>
            <h1 className="ms-confirm-title">Thank you, {confirmedOrder.customerName}!</h1>
            <p className="ms-confirm-sub">
              Your order has been placed with <strong>{settings.storeName}</strong>. Save your
              Order ID &amp; Phone number to check status anytime on the Orders page.
            </p>

            <div className="ms-confirm-id-box">
              <div>
                <span className="ms-confirm-label">Order ID</span>
                <strong className="ms-confirm-id-val">{confirmedOrder.id}</strong>
              </div>
              <div>
                <span className="ms-confirm-label">Phone Number</span>
                <strong>{confirmedOrder.customerPhone}</strong>
              </div>
              <div>
                <span className="ms-confirm-label">Total Payable (COD)</span>
                <strong>₹{confirmedOrder.finalAmount.toLocaleString('en-IN')}</strong>
              </div>
            </div>

            <div className="ms-confirm-actions">
              <a
                href={buildWhatsAppUrl(confirmedOrder)}
                target="_blank"
                rel="noopener noreferrer"
                className="ms-whatsapp-btn"
              >
                <MessageCircle size={19} />
                <span>WhatsApp par bhejo</span>
              </a>

              <Link
                to={`/orders?orderId=${encodeURIComponent(
                  confirmedOrder.id
                )}&phone=${encodeURIComponent(confirmedOrder.customerPhone)}`}
                className="ms-primary-btn"
              >
                <Package size={17} />
                <span>Track Order Status</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ms-page-cart">
      <div className="ms-container ms-section-pad">
        <h1 className="ms-page-heading">Shopping Cart &amp; Checkout ({totalItems})</h1>

        {populatedCart.length === 0 ? (
          <div className="ms-empty-box">
            <ShoppingBag size={48} color="#4338ca" />
            <h2>Your Cart is empty!</h2>
            <p>Browse products at {settings.storeName} and add items to your cart.</p>
            <Link to="/" className="ms-primary-btn">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="ms-cart-layout">
            {/* Left Column: Cart Items + Customer Checkout Form */}
            <div className="ms-cart-main-col">
              {/* Free Delivery Progress Banner */}
              {amountNeededForFreeDelivery > 0 ? (
                <div className="ms-free-delivery-nudge">
                  Add items worth <strong>₹{amountNeededForFreeDelivery}</strong> more for{' '}
                  <strong>FREE Delivery</strong> (Free above ₹{settings.freeDeliveryAmount})
                </div>
              ) : (
                <div className="ms-free-delivery-nudge unlocked">
                  Your order qualifies for <strong>FREE Delivery</strong>!
                </div>
              )}

              {/* Cart Items List */}
              <div className="ms-cart-items-card">
                {populatedCart.map(({ product, quantity }) => (
                  <div key={product.id} className="ms-cart-item-row">
                    <div className="ms-cart-item-top">
                      <Link to={`/product/${product.id}`} className="ms-cart-item-thumb">
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

                      <div className="ms-cart-item-details">
                        <Link to={`/product/${product.id}`} className="ms-cart-item-title">
                          {product.name}
                        </Link>
                        <span className="ms-cart-item-brand">
                          Category: {product.categoryName}
                        </span>

                        <div className="ms-cart-price-line">
                          <span className="ms-cart-price">
                            ₹{(product.price * quantity).toLocaleString('en-IN')}
                          </span>
                          {product.mrp > product.price && (
                            <>
                              <span className="ms-cart-mrp">
                                ₹{(product.mrp * quantity).toLocaleString('en-IN')}
                              </span>
                              <span className="ms-cart-disc">{product.discount}% Off</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quantity Stepper & Remove */}
                    <div className="ms-cart-item-actions">
                      <div className="ms-qty-stepper">
                        <button
                          type="button"
                          className="ms-qty-btn"
                          onClick={() => updateCartQty(product.id, -1)}
                          disabled={quantity <= 1}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="ms-qty-value">{quantity}</span>
                        <button
                          type="button"
                          className="ms-qty-btn"
                          onClick={() => updateCartQty(product.id, 1)}
                          disabled={quantity >= product.stock}
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        type="button"
                        className="ms-cart-text-btn danger"
                        onClick={() => removeFromCart(product.id)}
                      >
                        <Trash2 size={14} />
                        <span>REMOVE</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Customer Delivery & COD Checkout Form */}
              <div className="ms-checkout-card">
                <h2 className="ms-checkout-heading">Delivery Address &amp; Checkout</h2>
                <form id="ms-checkout-form" onSubmit={handleCheckoutSubmit} className="ms-checkout-form">
                  <div className="ms-form-grid-2">
                    <div className="ms-field-group">
                      <label htmlFor="chk-name" className="ms-input-label">
                        Full Name *
                      </label>
                      <input
                        id="chk-name"
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Enter your full name"
                        className="ms-text-input"
                        required
                      />
                    </div>

                    <div className="ms-field-group">
                      <label htmlFor="chk-phone" className="ms-input-label">
                        10-Digit Mobile Number *
                      </label>
                      <input
                        id="chk-phone"
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        value={customerPhone}
                        onChange={(e) =>
                          setCustomerPhone(e.target.value.replace(/\D/g, ''))
                        }
                        placeholder="9876543210"
                        className="ms-text-input"
                        required
                      />
                    </div>
                  </div>

                  <div className="ms-field-group">
                    <label htmlFor="chk-address" className="ms-input-label">
                      Complete Delivery Address (House No., Street, Landmark) *
                    </label>
                    <textarea
                      id="chk-address"
                      rows={2}
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder="House/Flat No., Building, Area, City"
                      className="ms-textarea-input"
                      required
                    />
                  </div>

                  <div className="ms-form-grid-2">
                    <div className="ms-field-group">
                      <label htmlFor="chk-pincode" className="ms-input-label">
                        Pincode *
                      </label>
                      <input
                        id="chk-pincode"
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                        placeholder="e.g. 201301"
                        className="ms-text-input"
                        required
                      />
                      {settings.serviceablePincodes && (
                        <span className="ms-field-hint">
                          Serviceable: {settings.serviceablePincodes}
                        </span>
                      )}
                    </div>

                    <div className="ms-field-group">
                      <label htmlFor="chk-type" className="ms-input-label">
                        Delivery Preference
                      </label>
                      <select
                        id="chk-type"
                        value={orderType}
                        onChange={(e) =>
                          setOrderType(e.target.value as 'Daily' | 'Advance')
                        }
                        className="ms-select-input"
                      >
                        <option value="Daily">Regular / Daily Delivery</option>
                        <option value="Advance">Advance / Scheduled Order</option>
                      </select>
                    </div>
                  </div>

                  <div className="ms-payment-cod-box">
                    <input type="radio" checked readOnly id="cod-radio" />
                    <label htmlFor="cod-radio">
                      <strong>Cash on Delivery (COD)</strong> — Pay in cash when your order arrives
                      at your doorstep.
                    </label>
                  </div>

                  {formError && <p className="ms-form-error">{formError}</p>}
                </form>
              </div>
            </div>

            {/* Right Column: Price Details Breakdown + Place Order CTA */}
            <aside className="ms-cart-summary-col">
              <div className="ms-price-details-card">
                <h2 className="ms-price-card-head">PRICE DETAILS</h2>

                <div className="ms-price-breakdown">
                  <div className="ms-price-line-item">
                    <span>Price ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
                    <span>₹{totalMrp.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="ms-price-line-item">
                    <span>Discount</span>
                    <span className="ms-green-text">− ₹{totalDiscount.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="ms-price-line-item">
                    <span>Delivery Charges</span>
                    {deliveryFee === 0 ? (
                      <span>
                        <del className="ms-muted-del">₹{settings.deliveryFee}</del>{' '}
                        <strong className="ms-green-text">FREE</strong>
                      </span>
                    ) : (
                      <span>₹{deliveryFee}</span>
                    )}
                  </div>

                  <div className="ms-price-total-row">
                    <span>Total Amount</span>
                    <span>₹{finalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {totalDiscount > 0 && (
                  <div className="ms-savings-callout">
                    You save ₹{totalDiscount.toLocaleString('en-IN')} on this order
                  </div>
                )}

                <button
                  type="submit"
                  form="ms-checkout-form"
                  className="ms-place-order-btn"
                >
                  <span>PLACE ORDER (COD)</span>
                  <ArrowRight size={18} />
                </button>
              </div>

              <div className="ms-safe-checkout-note">
                <ShieldCheck size={20} color="#6b7280" />
                <span>
                  Direct order with {settings.storeName}. Pay on delivery.
                </span>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};
