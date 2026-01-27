'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '@/scss/styles/HomePage/HomeLeft.module.scss';
import { getUserInfo, logout } from '@/libs/server/HomePage/signup';
import { getAllBrands } from '@/libs/server/HomePage/brand';
import { Brand } from '@/libs/types/homepage/brand';

interface HomeLeftProps {
  isDarkMode?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  refreshTrigger?: number; // Used to trigger refresh when new brand is created
}

const HomeLeft: React.FC<HomeLeftProps> = ({
  isDarkMode = true,
  isOpen = true,
  onClose,
  refreshTrigger = 0
}) => {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState('product-visuals');
  const [activeBrandId, setActiveBrandId] = useState<string | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoadingBrands, setIsLoadingBrands] = useState(true);

  // Get user info from localStorage
  const userInfo = getUserInfo();

  // Fetch brands from backend
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setIsLoadingBrands(true);
        const fetchedBrands = await getAllBrands();
        setBrands(fetchedBrands);
      } catch (error) {
        console.error('Error fetching brands:', error);
        setBrands([]);
      } finally {
        setIsLoadingBrands(false);
      }
    };

    fetchBrands();
  }, [refreshTrigger]); // Re-fetch when refreshTrigger changes

  const handleLogout = () => {
    logout();
    router.push('/signup');
  };

  const handleMenuClick = (menuId: string, path?: string) => {
    setActiveMenu(menuId);
    setActiveBrandId(null);
    if (path) {
      router.push(path);
    }
    if (onClose) onClose();
  };

  const handleBrandClick = (brandId: string) => {
    setActiveBrandId(brandId);
    setActiveMenu('');
    if (onClose) onClose();
  };

  return (
    <div className={`${styles.sidebar} ${!isDarkMode ? styles.light : ''} ${isOpen ? styles.open : ''}`}>
      {/* Logo */}
      <div className={styles.logo}>
        ROMIMI
      </div>

      {/* Main Content */}
      <div className={styles.content}>
        {/* CREATE Section */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>CREATE</div>

          <button
            className={`${styles.menuItem} ${activeMenu === 'product-visuals' ? styles.active : ''}`}
            onClick={() => handleMenuClick('product-visuals', '/')}
          >
            <span className={styles.icon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </span>
            <span className={styles.label}>Product Visuals</span>
          </button>

          <button
            className={`${styles.menuItem} ${activeMenu === 'ad-recreation' ? styles.active : ''}`}
            onClick={() => handleMenuClick('ad-recreation', '/ad-recreation')}
          >
            <span className={styles.icon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </span>
            <span className={styles.label}>Ad Recreation</span>
          </button>
        </div>

        {/* COLLECTIONS Section */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Library</div>

          <button
            className={`${styles.menuItem} ${activeBrandId === null && activeMenu === '' ? styles.active : ''}`}
            onClick={() => {
              setActiveBrandId(null);
              setActiveMenu('');
            }}
          >
            <span className={styles.icon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />
              </svg>
            </span>
            <span className={styles.label}>All Products</span>
            <span className={styles.badge}>{brands.length}</span>
          </button>

          {/* Loading State */}
          {isLoadingBrands && (
            <div className={styles.loadingItem}>
              <span className={styles.loadingText}>Loading brands...</span>
            </div>
          )}

          {/* Dynamic Brands from API */}
          {!isLoadingBrands && brands.map((brand) => (
            <button
              key={brand.id}
              className={`${styles.menuItem} ${activeBrandId === brand.id ? styles.active : ''}`}
              onClick={() => handleBrandClick(brand.id)}
            >
              <span className={styles.icon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
              </span>
              <span className={styles.label}>{brand.name}</span>
            </button>
          ))}

          {/* No brands message */}
          {!isLoadingBrands && brands.length === 0 && (
            <div className={styles.emptyMessage}>
              No brands yet. Create your first brand!
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <button
          className={styles.footerItem}
          onClick={() => handleMenuClick('da-templates', '/templates')}
        >
          <span className={styles.icon}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          </span>
          <span className={styles.label}>DA Templates</span>
        </button>

        <button
          className={styles.footerItem}
          onClick={() => handleMenuClick('settings', '/settings')}
        >
          <span className={styles.icon}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24" />
            </svg>
          </span>
          <span className={styles.label}>Settings</span>
        </button>

        {/* User Profile */}
        <div className={styles.userProfile}>
          <div className={styles.avatar}>
            {userInfo?.name?.[0]?.toUpperCase() || userInfo?.email?.[0]?.toUpperCase() || 'G'}
          </div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>
              {userInfo?.name || userInfo?.email?.split('@')[0] || 'gayratjon'}
            </div>
            <div className={styles.userPlan}>Pro Plan</div>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeLeft;
