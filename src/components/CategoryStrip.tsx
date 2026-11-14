import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export const CategoryStrip: React.FC = () => {
  const { categories } = useStore();
  const location = useLocation();

  return (
    <nav className="ms-category-strip" aria-label="Product Categories">
      <div className="ms-container">
        <div className="ms-category-scroll">
          <Link
            to="/"
            className={`ms-category-item ${location.pathname === '/' ? 'active' : ''}`}
          >
            <div
              className="ms-category-icon-box"
              style={{
                backgroundColor: '#eef2ff',
                borderColor: location.pathname === '/' ? '#4338ca' : 'transparent',
              }}
            >
              <span className="ms-category-emoji" role="img" aria-label="All">
                🛍️
              </span>
            </div>
            <span className="ms-category-label">All Items</span>
          </Link>

          {categories.map((cat) => {
            const targetPath = `/category/${cat.slug}`;
            const isActive = location.pathname === targetPath;

            return (
              <Link
                key={cat.slug}
                to={targetPath}
                className={`ms-category-item ${isActive ? 'active' : ''}`}
              >
                <div
                  className="ms-category-icon-box"
                  style={{
                    backgroundColor: cat.bgColor || '#eef2ff',
                    borderColor: isActive ? '#4338ca' : 'transparent',
                  }}
                >
                  {cat.imageUrl ? (
                    <img
                      src={cat.imageUrl}
                      alt={cat.name}
                      className="ms-category-img"
                      loading="lazy"
                    />
                  ) : (
                    <span className="ms-category-emoji" role="img" aria-label={cat.name}>
                      {cat.emoji || '📦'}
                    </span>
                  )}
                </div>
                <span className="ms-category-label">{cat.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
