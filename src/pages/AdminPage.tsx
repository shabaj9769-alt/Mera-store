import React, { useState } from 'react';
import {
  Shield,
  Package,
  ShoppingBag,
  Grid,
  Image,
  Settings,
  LogOut,
  Plus,
  Trash2,
  Edit3,
  Star,
  Eye,
  EyeOff,
  CheckCircle2,
  MapPin,
  Phone,
  Lock,
} from 'lucide-react';
import { useStore, OrderStatus } from '../context/StoreContext';
import { Product, CategoryItem, BannerSlide, StoreSettings } from '../data/products';

type AdminTab = 'orders' | 'products' | 'categories' | 'banners' | 'settings';
type OrderSubFolder = 'All' | 'Daily' | 'Advance' | 'Delivered' | 'Cancelled';

export const AdminPage: React.FC = () => {
  const {
    products,
    categories,
    banners,
    settings,
    orders,
    isAdminLoggedIn,
    allowedAdminEmail,
    adminLogin,
    adminLogout,
    saveProduct,
    deleteProduct,
    toggleProductBestSeller,
    toggleProductActive,
    saveCategory,
    deleteCategory,
    saveBanners,
    updateOrderStatus,
    updateSettings,
  } = useStore();

  // Admin Login State
  const [loginEmail, setLoginEmail] = useState(allowedAdminEmail);
  const [loginPassword, setLoginPassword] = useState('admin123');
  const [loginError, setLoginError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<AdminTab>('orders');
  const [orderFolder, setOrderFolder] = useState<OrderSubFolder>('All');

  // Product Form State
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodBrand, setProdBrand] = useState('');
  const [prodCategorySlug, setProdCategorySlug] = useState(categories[0]?.slug || 'mobiles');
  const [prodPrice, setProdPrice] = useState<number>(499);
  const [prodMrp, setProdMrp] = useState<number>(999);
  const [prodStock, setProdStock] = useState<number>(15);
  const [prodDesc, setProdDesc] = useState('');
  const [prodImagesText, setProdImagesText] = useState('');
  const [prodIsBestSeller, setProdIsBestSeller] = useState(false);
  const [prodIsActive, setProdIsActive] = useState(true);
  const [prodSpecsRows, setProdSpecsRows] = useState<{ key: string; value: string }[]>([
    { key: 'Warranty', value: '1 Year Store Warranty' },
  ]);
  const [showProductForm, setShowProductForm] = useState(false);

  // Category Form State
  const [editingCatSlug, setEditingCatSlug] = useState<string | null>(null);
  const [catName, setCatName] = useState('');
  const [catEmoji, setCatEmoji] = useState('🛍️');
  const [catImageUrl, setCatImageUrl] = useState('');

  // Banners Form State
  const [bannerDrafts, setBannerDrafts] = useState<BannerSlide[]>(() => banners.slice(0, 3));

  // Settings Form State
  const [settingsDraft, setSettingsDraft] = useState<StoreSettings>(() => settings);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = adminLogin(loginEmail, loginPassword);
    if (!res.ok) {
      setLoginError(res.error || 'Invalid credentials');
    } else {
      setLoginError('');
    }
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="ms-page-admin-login">
        <div className="ms-container ms-section-pad">
          <div className="ms-auth-box">
            <div className="ms-auth-banner">
              <div>
                <h2>Store Owner Admin</h2>
                <p>
                  Sign in with the authorized owner email to manage products, categories, banners,
                  orders, and settings for <strong>{settings.storeName}</strong>.
                </p>
              </div>
              <div className="ms-auth-trust-pill">
                <Shield size={18} color="#f97316" />
                <span>Restricted to VITE_ADMIN_EMAIL</span>
              </div>
            </div>

            <div className="ms-auth-form-col">
              <form onSubmit={handleLoginSubmit} className="ms-auth-form">
                <div className="ms-otp-sent-banner">
                  <span>
                    Allowed Admin Email: <strong>{allowedAdminEmail}</strong>
                  </span>
                </div>

                <label className="ms-input-label" htmlFor="admin-email">
                  Owner Email Address
                </label>
                <input
                  id="admin-email"
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder={allowedAdminEmail}
                  className="ms-text-input"
                  required
                />

                <label className="ms-input-label" htmlFor="admin-pass">
                  Admin Password (Demo pre-filled)
                </label>
                <input
                  id="admin-pass"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter password"
                  className="ms-text-input"
                  required
                />

                {loginError && <p className="ms-form-error">{loginError}</p>}

                <button type="submit" className="ms-auth-submit-btn">
                  <Lock size={16} />
                  <span>Login to Admin Panel</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Sub-folder counts for Orders
  const dailyOrders = orders.filter(
    (o) =>
      o.orderType === 'Daily' &&
      o.status !== 'Delivered' &&
      o.status !== 'Cancelled'
  );
  const advanceOrders = orders.filter(
    (o) =>
      o.orderType === 'Advance' &&
      o.status !== 'Delivered' &&
      o.status !== 'Cancelled'
  );
  const deliveredOrders = orders.filter((o) => o.status === 'Delivered');
  const cancelledOrders = orders.filter((o) => o.status === 'Cancelled');

  const filteredOrders = orders.filter((o) => {
    switch (orderFolder) {
      case 'Daily':
        return (
          o.orderType === 'Daily' &&
          o.status !== 'Delivered' &&
          o.status !== 'Cancelled'
        );
      case 'Advance':
        return (
          o.orderType === 'Advance' &&
          o.status !== 'Delivered' &&
          o.status !== 'Cancelled'
        );
      case 'Delivered':
        return o.status === 'Delivered';
      case 'Cancelled':
        return o.status === 'Cancelled';
      default:
        return true;
    }
  });

  // Open Product Form for Add or Edit
  const openAddProduct = () => {
    setEditingProductId(null);
    setProdName('');
    setProdBrand(settings.storeName);
    setProdCategorySlug(categories[0]?.slug || 'mobiles');
    setProdPrice(499);
    setProdMrp(999);
    setProdStock(20);
    setProdDesc('');
    setProdImagesText('');
    setProdIsBestSeller(false);
    setProdIsActive(true);
    setProdSpecsRows([{ key: 'Quality', value: '100% Genuine Store Product' }]);
    setShowProductForm(true);
  };

  const openEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setProdName(p.name);
    setProdBrand(p.brand);
    setProdCategorySlug(p.categorySlug);
    setProdPrice(p.price);
    setProdMrp(p.mrp);
    setProdStock(p.stock);
    setProdDesc(p.description);
    setProdImagesText((p.images || []).join('\n'));
    setProdIsBestSeller(p.isBestSeller);
    setProdIsActive(p.isActive);
    const rows = Object.entries(p.specs || {}).map(([key, value]) => ({ key, value }));
    setProdSpecsRows(rows.length > 0 ? rows : [{ key: '', value: '' }]);
    setShowProductForm(true);
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setProdImagesText((prev) =>
          prev.trim() ? `${prev.trim()}\n${reader.result}` : (reader.result as string)
        );
      }
    };
    reader.readAsDataURL(file);
  };

  const handleProductFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const catObj = categories.find((c) => c.slug === prodCategorySlug) || categories[0];
    const specsObj: Record<string, string> = {};
    for (const row of prodSpecsRows) {
      if (row.key.trim() && row.value.trim()) {
        specsObj[row.key.trim()] = row.value.trim();
      }
    }
    const imageList = prodImagesText
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    saveProduct({
      id: editingProductId || undefined,
      name: prodName.trim(),
      brand: prodBrand.trim() || settings.storeName,
      categorySlug: catObj ? catObj.slug : 'mobiles',
      categoryName: catObj ? catObj.name : 'Mobiles',
      price: Number(prodPrice) || 0,
      mrp: Math.max(Number(prodPrice) || 0, Number(prodMrp) || 0),
      rating: 4.5,
      reviewsCount: 25,
      stock: Math.max(0, Number(prodStock) || 0),
      description: prodDesc.trim() || `${prodName.trim()} available at ${settings.storeName}.`,
      images: imageList,
      isBestSeller: prodIsBestSeller,
      isActive: prodIsActive,
      illustrationType: 'smartphone',
      gradientFrom: '#e0e7ff',
      gradientTo: '#c7d2fe',
      accentColor: '#4338ca',
      specs: specsObj,
    });
    setShowProductForm(false);
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;
    const generatedSlug =
      editingCatSlug ||
      catName
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

    saveCategory(
      {
        slug: generatedSlug,
        name: catName.trim(),
        emoji: catEmoji.trim() || '🛍️',
        imageUrl: catImageUrl.trim() || undefined,
        bgColor: '#eef2ff',
        accentColor: '#4338ca',
      },
      editingCatSlug || undefined
    );
    setEditingCatSlug(null);
    setCatName('');
    setCatEmoji('🛍️');
    setCatImageUrl('');
  };

  return (
    <div className="ms-page-admin">
      <div className="ms-container ms-section-pad">
        {/* Admin Top Header */}
        <div className="ms-admin-header-card">
          <div className="ms-admin-title-group">
            <Shield size={22} color="#4338ca" />
            <div>
              <h1 className="ms-admin-title">{settings.storeName} — Admin Panel</h1>
              <span className="ms-admin-sub">Logged in as {allowedAdminEmail}</span>
            </div>
          </div>

          <button type="button" className="ms-danger-outline-btn" onClick={adminLogout}>
            <LogOut size={15} />
            <span>Logout</span>
          </button>
        </div>

        {/* 5 Admin Navigation Tabs */}
        <div className="ms-admin-tabs">
          <button
            type="button"
            className={`ms-admin-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <Package size={16} />
            <span>Orders ({orders.length})</span>
          </button>
          <button
            type="button"
            className={`ms-admin-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <ShoppingBag size={16} />
            <span>Products ({products.length})</span>
          </button>
          <button
            type="button"
            className={`ms-admin-tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            <Grid size={16} />
            <span>Categories ({categories.length})</span>
          </button>
          <button
            type="button"
            className={`ms-admin-tab-btn ${activeTab === 'banners' ? 'active' : ''}`}
            onClick={() => setActiveTab('banners')}
          >
            <Image size={16} />
            <span>Banners ({banners.length})</span>
          </button>
          <button
            type="button"
            className={`ms-admin-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={16} />
            <span>Settings</span>
          </button>
        </div>

        {/* TAB 1: ORDERS */}
        {activeTab === 'orders' && (
          <div className="ms-admin-panel-card">
            <div className="ms-admin-sec-head">
              <h2>Manage Customer Orders</h2>
            </div>

            {/* Sub-folders with counts: All, Daily, Advance, Delivered, Cancelled */}
            <div className="ms-order-folders">
              {(
                [
                  { key: 'All', label: 'All Orders', count: orders.length },
                  { key: 'Daily', label: 'Daily', count: dailyOrders.length },
                  { key: 'Advance', label: 'Advance', count: advanceOrders.length },
                  { key: 'Delivered', label: 'Delivered', count: deliveredOrders.length },
                  { key: 'Cancelled', label: 'Cancelled', count: cancelledOrders.length },
                ] as const
              ).map((f) => (
                <button
                  key={f.key}
                  type="button"
                  className={`ms-folder-pill ${orderFolder === f.key ? 'active' : ''}`}
                  onClick={() => setOrderFolder(f.key)}
                >
                  <span>{f.label}</span>
                  <span className="ms-folder-count">{f.count}</span>
                </button>
              ))}
            </div>

            {filteredOrders.length === 0 ? (
              <div className="ms-empty-box">
                <p>No orders in the &ldquo;{orderFolder}&rdquo; folder.</p>
              </div>
            ) : (
              <div className="ms-orders-stack">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="ms-order-card">
                    <div className="ms-order-card-head">
                      <div className="ms-order-meta-left">
                        <span className="ms-order-id-pill">#{order.id}</span>
                        <span className="ms-folder-tag">{order.orderType}</span>
                        <span className="ms-order-date">{order.createdAt}</span>
                      </div>

                      <div className="ms-admin-status-controls">
                        <span className="ms-status-label">Status:</span>
                        {(
                          ['Placed', 'Confirmed', 'Delivered', 'Cancelled'] as OrderStatus[]
                        ).map((st) => (
                          <button
                            key={st}
                            type="button"
                            className={`ms-status-action-btn ${
                              order.status === st ? `active ${st.toLowerCase()}` : ''
                            }`}
                            onClick={() => updateOrderStatus(order.id, st)}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="ms-admin-customer-box">
                      <div>
                        <strong>Customer:</strong> {order.customerName}
                      </div>
                      <div>
                        <Phone size={13} /> <strong>Phone:</strong> {order.customerPhone}
                      </div>
                      <div>
                        <MapPin size={13} /> <strong>Address:</strong> {order.customerAddress} —{' '}
                        <strong>Pincode:</strong> {order.pincode}
                      </div>
                    </div>

                    <div className="ms-order-items-list">
                      {order.items.map((it) => (
                        <div key={it.productId} className="ms-admin-order-line">
                          <span>
                            {it.name} <strong>× {it.quantity}</strong>
                          </span>
                          <strong>₹{(it.price * it.quantity).toLocaleString('en-IN')}</strong>
                        </div>
                      ))}
                    </div>

                    <div className="ms-order-card-foot">
                      <span>Payment: {order.paymentMethod}</span>
                      <strong>
                        Total Payable: ₹{order.finalAmount.toLocaleString('en-IN')}
                      </strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PRODUCTS */}
        {activeTab === 'products' && (
          <div className="ms-admin-panel-card">
            <div className="ms-admin-sec-head">
              <h2>Store Products ({products.length})</h2>
              <button type="button" className="ms-primary-btn" onClick={openAddProduct}>
                <Plus size={16} />
                <span>Add New Product</span>
              </button>
            </div>

            {showProductForm && (
              <form onSubmit={handleProductFormSubmit} className="ms-admin-form-box">
                <h3>{editingProductId ? 'Edit Product' : 'Add New Product'}</h3>

                <div className="ms-form-grid-2">
                  <div className="ms-field-group">
                    <label className="ms-input-label">Product Name *</label>
                    <input
                      type="text"
                      value={prodName}
                      onChange={(e) => setProdName(e.target.value)}
                      placeholder="e.g. Wireless Bluetooth Neckband"
                      className="ms-text-input"
                      required
                    />
                  </div>

                  <div className="ms-field-group">
                    <label className="ms-input-label">Category *</label>
                    <select
                      value={prodCategorySlug}
                      onChange={(e) => setProdCategorySlug(e.target.value)}
                      className="ms-select-input"
                    >
                      {categories.map((c) => (
                        <option key={c.slug} value={c.slug}>
                          {c.emoji} {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="ms-form-grid-3">
                  <div className="ms-field-group">
                    <label className="ms-input-label">Selling Price (₹) *</label>
                    <input
                      type="number"
                      min={1}
                      value={prodPrice}
                      onChange={(e) => setProdPrice(Number(e.target.value))}
                      className="ms-text-input"
                      required
                    />
                  </div>

                  <div className="ms-field-group">
                    <label className="ms-input-label">MRP (₹) *</label>
                    <input
                      type="number"
                      min={1}
                      value={prodMrp}
                      onChange={(e) => setProdMrp(Number(e.target.value))}
                      className="ms-text-input"
                      required
                    />
                  </div>

                  <div className="ms-field-group">
                    <label className="ms-input-label">Stock Quantity (0 = Out of Stock) *</label>
                    <input
                      type="number"
                      min={0}
                      value={prodStock}
                      onChange={(e) => setProdStock(Number(e.target.value))}
                      className="ms-text-input"
                      required
                    />
                  </div>
                </div>

                <div className="ms-field-group">
                  <label className="ms-input-label">Product Description</label>
                  <textarea
                    rows={2}
                    value={prodDesc}
                    onChange={(e) => setProdDesc(e.target.value)}
                    placeholder="Write product details, warranty, and highlights..."
                    className="ms-textarea-input"
                  />
                </div>

                {/* Images URL or File Upload */}
                <div className="ms-field-group">
                  <label className="ms-input-label">
                    Product Image URLs (1 per line, or upload photo below; leave blank for store SVG
                    placeholder)
                  </label>
                  <textarea
                    rows={2}
                    value={prodImagesText}
                    onChange={(e) => setProdImagesText(e.target.value)}
                    placeholder="https://res.cloudinary.com/.../image.jpg"
                    className="ms-textarea-input"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileUpload}
                    className="ms-file-input"
                  />
                </div>

                {/* Specs Key-Value Rows */}
                <div className="ms-field-group">
                  <div className="ms-specs-editor-head">
                    <label className="ms-input-label">Specifications (Key - Value Rows)</label>
                    <button
                      type="button"
                      className="ms-outline-sm-btn"
                      onClick={() =>
                        setProdSpecsRows((prev) => [...prev, { key: '', value: '' }])
                      }
                    >
                      + Add Spec Row
                    </button>
                  </div>
                  <div className="ms-specs-rows-stack">
                    {prodSpecsRows.map((row, idx) => (
                      <div key={idx} className="ms-spec-edit-row">
                        <input
                          type="text"
                          value={row.key}
                          onChange={(e) =>
                            setProdSpecsRows((prev) =>
                              prev.map((r, i) => (i === idx ? { ...r, key: e.target.value } : r))
                            )
                          }
                          placeholder="Key (e.g. Battery)"
                          className="ms-text-input"
                        />
                        <input
                          type="text"
                          value={row.value}
                          onChange={(e) =>
                            setProdSpecsRows((prev) =>
                              prev.map((r, i) =>
                                i === idx ? { ...r, value: e.target.value } : r
                              )
                            )
                          }
                          placeholder="Value (e.g. 5000 mAh)"
                          className="ms-text-input"
                        />
                        <button
                          type="button"
                          className="ms-icon-del-btn"
                          onClick={() =>
                            setProdSpecsRows((prev) => prev.filter((_, i) => i !== idx))
                          }
                          aria-label="Remove spec row"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Toggles: Best Seller & Active/Hidden */}
                <div className="ms-admin-toggles-row">
                  <label className="ms-checkbox-label">
                    <input
                      type="checkbox"
                      checked={prodIsBestSeller}
                      onChange={(e) => setProdIsBestSeller(e.target.checked)}
                    />
                    <span>★ Mark as Best Seller</span>
                  </label>

                  <label className="ms-checkbox-label">
                    <input
                      type="checkbox"
                      checked={prodIsActive}
                      onChange={(e) => setProdIsActive(e.target.checked)}
                    />
                    <span>Active (Visible to customers)</span>
                  </label>
                </div>

                <div className="ms-admin-form-actions">
                  <button type="submit" className="ms-primary-btn">
                    <CheckCircle2 size={16} />
                    <span>Save Product</span>
                  </button>
                  <button
                    type="button"
                    className="ms-outline-sm-btn"
                    onClick={() => setShowProductForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Admin Products Table/List */}
            <div className="ms-admin-prod-list">
              {products.map((p) => (
                <div
                  key={p.id}
                  className={`ms-admin-prod-row ${!p.isActive ? 'hidden-prod' : ''}`}
                >
                  <div className="ms-admin-prod-info">
                    <div className="ms-admin-prod-title-line">
                      <strong>{p.name}</strong>
                      {!p.isActive && <span className="ms-hidden-pill">Hidden</span>}
                      {p.stock <= 0 && <span className="ms-oos-pill">Out of Stock</span>}
                    </div>
                    <span className="ms-admin-prod-meta">
                      {p.categoryName} • Price: ₹{p.price} (MRP ₹{p.mrp}, {p.discount}% off) •
                      Stock: {p.stock}
                    </span>
                  </div>

                  <div className="ms-admin-prod-actions">
                    <button
                      type="button"
                      className={`ms-admin-icon-toggle ${p.isBestSeller ? 'starred' : ''}`}
                      onClick={() => toggleProductBestSeller(p.id)}
                      title="Toggle Best Seller Star"
                    >
                      <Star
                        size={16}
                        fill={p.isBestSeller ? '#f97316' : 'none'}
                        stroke={p.isBestSeller ? '#f97316' : '#6b7280'}
                      />
                    </button>

                    <button
                      type="button"
                      className="ms-admin-icon-toggle"
                      onClick={() => toggleProductActive(p.id)}
                      title={p.isActive ? 'Hide Product' : 'Show Product'}
                    >
                      {p.isActive ? (
                        <Eye size={16} color="#15803d" />
                      ) : (
                        <EyeOff size={16} color="#6b7280" />
                      )}
                    </button>

                    <button
                      type="button"
                      className="ms-admin-icon-toggle"
                      onClick={() => openEditProduct(p)}
                      title="Edit Product"
                    >
                      <Edit3 size={16} color="#4338ca" />
                    </button>

                    <button
                      type="button"
                      className="ms-admin-icon-toggle"
                      onClick={() => deleteProduct(p.id)}
                      title="Delete Product"
                    >
                      <Trash2 size={16} color="#dc2626" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: CATEGORIES */}
        {activeTab === 'categories' && (
          <div className="ms-admin-panel-card">
            <div className="ms-admin-sec-head">
              <h2>Manage Categories ({categories.length})</h2>
            </div>

            <form onSubmit={handleCategorySubmit} className="ms-admin-form-box">
              <h3>{editingCatSlug ? 'Rename / Edit Category' : 'Add New Category'}</h3>
              <div className="ms-form-grid-3">
                <div className="ms-field-group">
                  <label className="ms-input-label">Category Name *</label>
                  <input
                    type="text"
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    placeholder="e.g. Footwear"
                    className="ms-text-input"
                    required
                  />
                </div>
                <div className="ms-field-group">
                  <label className="ms-input-label">Emoji Icon</label>
                  <input
                    type="text"
                    value={catEmoji}
                    onChange={(e) => setCatEmoji(e.target.value)}
                    placeholder="👟"
                    className="ms-text-input"
                  />
                </div>
                <div className="ms-field-group">
                  <label className="ms-input-label">Image URL (Optional)</label>
                  <input
                    type="text"
                    value={catImageUrl}
                    onChange={(e) => setCatImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="ms-text-input"
                  />
                </div>
              </div>
              <div className="ms-admin-form-actions">
                <button type="submit" className="ms-primary-btn">
                  <span>{editingCatSlug ? 'Update Category' : 'Add Category'}</span>
                </button>
                {editingCatSlug && (
                  <button
                    type="button"
                    className="ms-outline-sm-btn"
                    onClick={() => {
                      setEditingCatSlug(null);
                      setCatName('');
                      setCatEmoji('🛍️');
                      setCatImageUrl('');
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <div className="ms-admin-prod-list">
              {categories.map((c: CategoryItem) => (
                <div key={c.slug} className="ms-admin-prod-row">
                  <div className="ms-admin-prod-info">
                    <strong>
                      {c.emoji} {c.name}
                    </strong>
                    <span className="ms-admin-prod-meta">Slug: /category/{c.slug}</span>
                  </div>
                  <div className="ms-admin-prod-actions">
                    <button
                      type="button"
                      className="ms-admin-icon-toggle"
                      onClick={() => {
                        setEditingCatSlug(c.slug);
                        setCatName(c.name);
                        setCatEmoji(c.emoji);
                        setCatImageUrl(c.imageUrl || '');
                      }}
                      title="Rename Category"
                    >
                      <Edit3 size={16} color="#4338ca" />
                    </button>
                    <button
                      type="button"
                      className="ms-admin-icon-toggle"
                      onClick={() => deleteCategory(c.slug)}
                      title="Delete Category"
                    >
                      <Trash2 size={16} color="#dc2626" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: BANNERS (Up to 3 Slides) */}
        {activeTab === 'banners' && (
          <div className="ms-admin-panel-card">
            <div className="ms-admin-sec-head">
              <h2>Home Banner Carousel (Up to 3 Slides)</h2>
            </div>

            <div className="ms-banners-editor-stack">
              {bannerDrafts.map((b, idx) => (
                <div key={b.id} className="ms-admin-form-box">
                  <h3>Banner Slide #{idx + 1}</h3>
                  <div className="ms-form-grid-2">
                    <div className="ms-field-group">
                      <label className="ms-input-label">Headline Title</label>
                      <input
                        type="text"
                        value={b.title}
                        onChange={(e) =>
                          setBannerDrafts((prev) =>
                            prev.map((item, i) =>
                              i === idx ? { ...item, title: e.target.value } : item
                            )
                          )
                        }
                        className="ms-text-input"
                      />
                    </div>
                    <div className="ms-field-group">
                      <label className="ms-input-label">Target Link (e.g. /category/mobiles)</label>
                      <input
                        type="text"
                        value={b.targetLink}
                        onChange={(e) =>
                          setBannerDrafts((prev) =>
                            prev.map((item, i) =>
                              i === idx ? { ...item, targetLink: e.target.value } : item
                            )
                          )
                        }
                        className="ms-text-input"
                      />
                    </div>
                  </div>

                  <div className="ms-form-grid-2">
                    <div className="ms-field-group">
                      <label className="ms-input-label">Subtitle</label>
                      <input
                        type="text"
                        value={b.subtitle}
                        onChange={(e) =>
                          setBannerDrafts((prev) =>
                            prev.map((item, i) =>
                              i === idx ? { ...item, subtitle: e.target.value } : item
                            )
                          )
                        }
                        className="ms-text-input"
                      />
                    </div>
                    <div className="ms-field-group">
                      <label className="ms-input-label">
                        Banner Image URL (Optional — uses SVG placeholder if blank)
                      </label>
                      <input
                        type="text"
                        value={b.imageUrl || ''}
                        onChange={(e) =>
                          setBannerDrafts((prev) =>
                            prev.map((item, i) =>
                              i === idx ? { ...item, imageUrl: e.target.value } : item
                            )
                          )
                        }
                        placeholder="https://..."
                        className="ms-text-input"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="ms-primary-btn"
              onClick={() => saveBanners(bannerDrafts)}
            >
              <CheckCircle2 size={16} />
              <span>Save All Banners</span>
            </button>
          </div>
        )}

        {/* TAB 5: STORE SETTINGS */}
        {activeTab === 'settings' && (
          <div className="ms-admin-panel-card">
            <div className="ms-admin-sec-head">
              <h2>Store Settings</h2>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateSettings(settingsDraft);
              }}
              className="ms-admin-form-box"
            >
              <div className="ms-form-grid-2">
                <div className="ms-field-group">
                  <label className="ms-input-label">Store Name</label>
                  <input
                    type="text"
                    value={settingsDraft.storeName}
                    onChange={(e) =>
                      setSettingsDraft((s) => ({ ...s, storeName: e.target.value }))
                    }
                    className="ms-text-input"
                    required
                  />
                </div>

                <div className="ms-field-group">
                  <label className="ms-input-label">Store Tagline / Product Type</label>
                  <input
                    type="text"
                    value={settingsDraft.productTypeTagline}
                    onChange={(e) =>
                      setSettingsDraft((s) => ({ ...s, productTypeTagline: e.target.value }))
                    }
                    className="ms-text-input"
                    required
                  />
                </div>
              </div>

              <div className="ms-form-grid-2">
                <div className="ms-field-group">
                  <label className="ms-input-label">
                    Store WhatsApp Number (with country code, e.g. 919876543210)
                  </label>
                  <input
                    type="text"
                    value={settingsDraft.whatsappNumber}
                    onChange={(e) =>
                      setSettingsDraft((s) => ({ ...s, whatsappNumber: e.target.value }))
                    }
                    className="ms-text-input"
                    required
                  />
                </div>

                <div className="ms-field-group">
                  <label className="ms-input-label">Display Phone Number</label>
                  <input
                    type="text"
                    value={settingsDraft.phoneNumber}
                    onChange={(e) =>
                      setSettingsDraft((s) => ({ ...s, phoneNumber: e.target.value }))
                    }
                    className="ms-text-input"
                    required
                  />
                </div>
              </div>

              <div className="ms-form-grid-2">
                <div className="ms-field-group">
                  <label className="ms-input-label">Delivery Fee (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={settingsDraft.deliveryFee}
                    onChange={(e) =>
                      setSettingsDraft((s) => ({
                        ...s,
                        deliveryFee: Number(e.target.value) || 0,
                      }))
                    }
                    className="ms-text-input"
                    required
                  />
                </div>

                <div className="ms-field-group">
                  <label className="ms-input-label">Free Delivery Above Amount (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={settingsDraft.freeDeliveryAmount}
                    onChange={(e) =>
                      setSettingsDraft((s) => ({
                        ...s,
                        freeDeliveryAmount: Number(e.target.value) || 0,
                      }))
                    }
                    className="ms-text-input"
                    required
                  />
                </div>
              </div>

              <div className="ms-field-group">
                <label className="ms-input-label">Header Delivery Area Text</label>
                <input
                  type="text"
                  value={settingsDraft.deliveryAreaText}
                  onChange={(e) =>
                    setSettingsDraft((s) => ({ ...s, deliveryAreaText: e.target.value }))
                  }
                  className="ms-text-input"
                  required
                />
              </div>

              <div className="ms-field-group">
                <label className="ms-input-label">
                  Serviceable Pincodes (comma-separated list; leave empty to allow all pincodes)
                </label>
                <input
                  type="text"
                  value={settingsDraft.serviceablePincodes}
                  onChange={(e) =>
                    setSettingsDraft((s) => ({ ...s, serviceablePincodes: e.target.value }))
                  }
                  placeholder="400001, 110001, 201301"
                  className="ms-text-input"
                />
              </div>

              <div className="ms-form-grid-2">
                <div className="ms-field-group">
                  <label className="ms-input-label">Store Address (shown in Footer)</label>
                  <input
                    type="text"
                    value={settingsDraft.storeAddress}
                    onChange={(e) =>
                      setSettingsDraft((s) => ({ ...s, storeAddress: e.target.value }))
                    }
                    className="ms-text-input"
                    required
                  />
                </div>

                <div className="ms-field-group">
                  <label className="ms-input-label">Store Timing (shown in Footer)</label>
                  <input
                    type="text"
                    value={settingsDraft.storeTiming}
                    onChange={(e) =>
                      setSettingsDraft((s) => ({ ...s, storeTiming: e.target.value }))
                    }
                    className="ms-text-input"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="ms-primary-btn">
                <CheckCircle2 size={16} />
                <span>Save Store Settings</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
