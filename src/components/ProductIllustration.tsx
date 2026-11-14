import React from 'react';
import { Product } from '../data/products';

interface ProductIllustrationProps {
  type: Product['illustrationType'];
  gradientFrom: string;
  gradientTo: string;
  accentColor: string;
  className?: string;
  angle?: number; // 0, 1, 2 for product gallery views
}

export const ProductIllustration: React.FC<ProductIllustrationProps> = ({
  type,
  gradientFrom,
  gradientTo,
  accentColor,
  className = '',
  angle = 0,
}) => {
  const renderSvg = () => {
    switch (type) {
      case 'smartphone':
        return (
          <svg viewBox="0 0 120 120" className="ms-illus-svg" aria-hidden="true">
            <rect
              x="34"
              y="14"
              width="52"
              height="92"
              rx="10"
              fill="#ffffff"
              stroke={accentColor}
              strokeWidth="4"
            />
            <rect x="39" y="22" width="42" height="74" rx="5" fill={accentColor} opacity="0.16" />
            <circle cx="60" cy="18" r="2" fill={accentColor} />
            <circle cx="48" cy="32" r="5" fill={accentColor} />
            <circle cx="48" cy="45" r="5" fill={accentColor} opacity="0.7" />
            <rect x="48" y="88" width="24" height="3" rx="1.5" fill={accentColor} />
          </svg>
        );
      case 'earbuds':
        return (
          <svg viewBox="0 0 120 120" className="ms-illus-svg" aria-hidden="true">
            <rect
              x="28"
              y="42"
              width="64"
              height="52"
              rx="20"
              fill="#ffffff"
              stroke={accentColor}
              strokeWidth="4"
            />
            <line x1="28" y1="64" x2="92" y2="64" stroke={accentColor} strokeWidth="3" />
            <circle cx="60" cy="76" r="4" fill={accentColor} />
            <path
              d="M42 40 V26 C42 20 52 20 52 26 V40"
              fill="none"
              stroke={accentColor}
              strokeWidth="4"
            />
            <path
              d="M68 40 V26 C68 20 78 20 78 26 V40"
              fill="none"
              stroke={accentColor}
              strokeWidth="4"
            />
          </svg>
        );
      case 'smartwatch':
        return (
          <svg viewBox="0 0 120 120" className="ms-illus-svg" aria-hidden="true">
            <rect x="46" y="12" width="28" height="22" rx="4" fill={accentColor} opacity="0.5" />
            <rect x="46" y="86" width="28" height="22" rx="4" fill={accentColor} opacity="0.5" />
            <rect
              x="32"
              y="30"
              width="56"
              height="60"
              rx="14"
              fill="#ffffff"
              stroke={accentColor}
              strokeWidth="4"
            />
            <circle cx="60" cy="60" r="18" fill={accentColor} opacity="0.15" />
            <polyline
              points="52,60 58,66 70,52"
              fill="none"
              stroke={accentColor}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case 'laptop':
        return (
          <svg viewBox="0 0 120 120" className="ms-illus-svg" aria-hidden="true">
            <rect
              x="22"
              y="26"
              width="76"
              height="50"
              rx="6"
              fill="#ffffff"
              stroke={accentColor}
              strokeWidth="4"
            />
            <rect x="28" y="32" width="64" height="38" rx="3" fill={accentColor} opacity="0.15" />
            <path
              d="M12 78 H108 L102 88 H18 Z"
              fill={accentColor}
            />
          </svg>
        );
      case 'tshirt':
        return (
          <svg viewBox="0 0 120 120" className="ms-illus-svg" aria-hidden="true">
            <path
              d="M38 24 L20 38 L28 54 L38 46 V94 H82 V46 L92 54 L100 38 L82 24 H70 C68 31 52 31 50 24 Z"
              fill="#ffffff"
              stroke={accentColor}
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <rect x="48" y="48" width="24" height="16" rx="3" fill={accentColor} opacity="0.22" />
          </svg>
        );
      case 'sneakers':
        return (
          <svg viewBox="0 0 120 120" className="ms-illus-svg" aria-hidden="true">
            <path
              d="M18 76 L24 44 L48 48 L68 62 L96 64 C102 64 104 72 104 78 H18 Z"
              fill="#ffffff"
              stroke={accentColor}
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <rect x="16" y="78" width="90" height="10" rx="5" fill={accentColor} />
            <line x1="36" y1="56" x2="54" y2="68" stroke={accentColor} strokeWidth="4" strokeLinecap="round" />
          </svg>
        );
      case 'kurta':
        return (
          <svg viewBox="0 0 120 120" className="ms-illus-svg" aria-hidden="true">
            <path
              d="M42 18 L24 34 L30 48 L40 40 L34 98 H86 L80 40 L90 48 L96 34 L78 18 H68 L60 28 L52 18 Z"
              fill="#ffffff"
              stroke={accentColor}
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <line x1="60" y1="28" x2="60" y2="56" stroke={accentColor} strokeWidth="3.5" />
            <circle cx="60" cy="66" r="4" fill={accentColor} opacity="0.4" />
          </svg>
        );
      case 'backpack':
        return (
          <svg viewBox="0 0 120 120" className="ms-illus-svg" aria-hidden="true">
            <path d="M48 24 C48 15 72 15 72 24" fill="none" stroke={accentColor} strokeWidth="4" />
            <rect
              x="30"
              y="26"
              width="60"
              height="70"
              rx="18"
              fill="#ffffff"
              stroke={accentColor}
              strokeWidth="4"
            />
            <rect
              x="40"
              y="56"
              width="40"
              height="28"
              rx="8"
              fill={accentColor}
              opacity="0.2"
              stroke={accentColor}
              strokeWidth="3"
            />
          </svg>
        );
      case 'serum':
      case 'lipstick':
        return (
          <svg viewBox="0 0 120 120" className="ms-illus-svg" aria-hidden="true">
            <rect x="52" y="16" width="16" height="16" rx="4" fill={accentColor} />
            <rect x="48" y="32" width="24" height="8" rx="2" fill="#ffffff" stroke={accentColor} strokeWidth="3" />
            <rect
              x="40"
              y="40"
              width="40"
              height="60"
              rx="10"
              fill="#ffffff"
              stroke={accentColor}
              strokeWidth="4"
            />
            <rect x="46" y="54" width="28" height="32" rx="4" fill={accentColor} opacity="0.22" />
          </svg>
        );
      case 'cookware':
      case 'bedsheet':
      case 'lamp':
        return (
          <svg viewBox="0 0 120 120" className="ms-illus-svg" aria-hidden="true">
            <path
              d="M26 52 H94 L86 88 C84 94 78 96 72 96 H48 C42 96 36 94 34 88 Z"
              fill="#ffffff"
              stroke={accentColor}
              strokeWidth="4"
            />
            <path d="M30 48 C40 34 80 34 90 48" fill="none" stroke={accentColor} strokeWidth="4" />
            <circle cx="60" cy="34" r="5" fill={accentColor} />
            <line x1="16" y1="56" x2="28" y2="56" stroke={accentColor} strokeWidth="5" strokeLinecap="round" />
            <line x1="92" y1="56" x2="104" y2="56" stroke={accentColor} strokeWidth="5" strokeLinecap="round" />
          </svg>
        );
      case 'airfryer':
      case 'mixer':
      case 'iron':
        return (
          <svg viewBox="0 0 120 120" className="ms-illus-svg" aria-hidden="true">
            <rect
              x="34"
              y="20"
              width="52"
              height="80"
              rx="18"
              fill="#ffffff"
              stroke={accentColor}
              strokeWidth="4"
            />
            <circle cx="60" cy="44" r="10" fill={accentColor} opacity="0.25" stroke={accentColor} strokeWidth="3" />
            <rect x="42" y="64" width="36" height="24" rx="6" fill={accentColor} opacity="0.18" />
            <line x1="60" y1="68" x2="60" y2="84" stroke={accentColor} strokeWidth="4" strokeLinecap="round" />
          </svg>
        );
      case 'book':
      case 'notebook':
        return (
          <svg viewBox="0 0 120 120" className="ms-illus-svg" aria-hidden="true">
            <rect
              x="30"
              y="18"
              width="60"
              height="84"
              rx="6"
              fill="#ffffff"
              stroke={accentColor}
              strokeWidth="4"
            />
            <line x1="42" y1="18" x2="42" y2="102" stroke={accentColor} strokeWidth="3" />
            <rect x="50" y="34" width="30" height="10" rx="2" fill={accentColor} opacity="0.3" />
            <line x1="50" y1="54" x2="76" y2="54" stroke={accentColor} strokeWidth="3" strokeLinecap="round" />
            <line x1="50" y1="66" x2="72" y2="66" stroke={accentColor} strokeWidth="3" strokeLinecap="round" />
          </svg>
        );
      case 'scooter':
      case 'evBike':
      case 'helmet':
      case 'carVacuum':
        return (
          <svg viewBox="0 0 120 120" className="ms-illus-svg" aria-hidden="true">
            <circle cx="32" cy="82" r="14" fill="#ffffff" stroke={accentColor} strokeWidth="4" />
            <circle cx="88" cy="82" r="14" fill="#ffffff" stroke={accentColor} strokeWidth="4" />
            <path
              d="M32 82 L48 54 H72 L62 82 H88 L76 36 H62"
              fill="none"
              stroke={accentColor}
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect x="42" y="48" width="24" height="8" rx="4" fill={accentColor} />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 120 120" className="ms-illus-svg" aria-hidden="true">
            <rect
              x="26"
              y="26"
              width="68"
              height="68"
              rx="16"
              fill="#ffffff"
              stroke={accentColor}
              strokeWidth="4"
            />
            <circle cx="60" cy="60" r="18" fill={accentColor} opacity="0.22" />
            <path
              d="M48 60 L56 68 L74 50"
              fill="none"
              stroke={accentColor}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
    }
  };

  const rotationDeg = angle === 1 ? -6 : angle === 2 ? 7 : 0;
  const scaleVal = angle === 1 ? 1.05 : angle === 2 ? 0.96 : 1;

  return (
    <div
      className={`ms-product-illus ${className}`}
      style={{
        background: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)`,
      }}
    >
      <div
        className="ms-illus-inner"
        style={{
          transform: `rotate(${rotationDeg}deg) scale(${scaleVal})`,
        }}
      >
        {renderSvg()}
      </div>
    </div>
  );
};
