/**
 * Example: Products/Features Management Page
 * 
 * This example shows how to integrate the ProductsList component
 * into your application.
 */

import { ProductsList } from '@/components/ProductsList';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

export function ProductsPage() {
  const { user, loading } = useAuth();

  // Redirect if not authenticated
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="products-page">
      <div className="page-header">
        <h1>Feature Management</h1>
        <p>Enable or disable features for your account</p>
      </div>

      <ProductsList />
    </div>
  );
}

// ============================================================================
// ALTERNATIVE: With Tabs (Active vs Available)
// ============================================================================

import { useState } from 'react';
import { getActiveUserProducts, getProductsWithStatus } from '@/services/products.service';
import { ProductModule } from '@/models/product.model';

export function ProductsPageWithTabs() {
  const [activeTab, setActiveTab] = useState<'all' | 'active'>('all');
  const [products, setProducts] = useState<ProductModule[]>([]);
  const { user } = useAuth();

  // Filter based on active tab
  const displayProducts = activeTab === 'active' 
    ? products.filter(p => p.isActive)
    : products;

  return (
    <div className="products-page">
      <div className="tabs">
        <button 
          className={activeTab === 'all' ? 'active' : ''}
          onClick={() => setActiveTab('all')}
        >
          All Features ({products.length})
        </button>
        <button 
          className={activeTab === 'active' ? 'active' : ''}
          onClick={() => setActiveTab('active')}
        >
          Active ({products.filter(p => p.isActive).length})
        </button>
      </div>

      <ProductsList />
    </div>
  );
}

// ============================================================================
// ALTERNATIVE: With Search/Filter
// ============================================================================

import { useMemo } from 'react';

export function ProductsPageWithSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [products, setProducts] = useState<ProductModule[]>([]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  return (
    <div className="products-page">
      <div className="filters">
        <input
          type="text"
          placeholder="Search features..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />

        <select 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-filter"
        >
          <option value="all">All Categories</option>
          <option value="GUEST">Guest Management</option>
          <option value="REVENUE">Revenue</option>
          <option value="OPS">Operations</option>
          <option value="PLAYBOOK">Playbook</option>
        </select>
      </div>

      {/* Render custom filtered list or pass to ProductsList */}
      <div className="products-results">
        {filteredProducts.length} features found
      </div>

      <ProductsList />
    </div>
  );
}

// ============================================================================
// INTEGRATION: Dashboard Widget
// ============================================================================

export function DashboardFeaturesWidget() {
  const [activeCount, setActiveCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      getActiveUserProducts(user.id).then(products => {
        setActiveCount(products.length);
      });
    }
  }, [user]);

  return (
    <div className="dashboard-widget">
      <h3>Active Features</h3>
      <div className="stat">
        <span className="count">{activeCount}</span>
        <span className="label">features enabled</span>
      </div>
      <a href="/features" className="manage-link">
        Manage Features →
      </a>
    </div>
  );
}

// ============================================================================
// INTEGRATION: Feature Gate Component
// ============================================================================

import { useEffect, useState } from 'react';
import { hasActiveProduct } from '@/services/products.service';

interface FeatureGateProps {
  productId: string;
  userId: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Component that only renders children if user has active feature
 */
export function FeatureGate({ productId, userId, fallback, children }: FeatureGateProps) {
  const [hasFeature, setHasFeature] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hasActiveProduct(userId, productId)
      .then(setHasFeature)
      .finally(() => setLoading(false));
  }, [userId, productId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!hasFeature) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
}

// Usage:
export function HeatingDashboard() {
  const { user } = useAuth();

  return (
    <FeatureGate 
      productId="heating-product-id" 
      userId={user!.id}
      fallback={
        <div className="upgrade-prompt">
          <h3>Heating Module Not Active</h3>
          <p>Activate this feature to access heating controls</p>
          <a href="/features">Manage Features</a>
        </div>
      }
    >
      {/* Heating dashboard content */}
      <div className="heating-controls">
        <h2>Heating Control System</h2>
        {/* ... */}
      </div>
    </FeatureGate>
  );
}

// ============================================================================
// INTEGRATION: React Router Protection
// ============================================================================

import { Outlet } from 'react-router-dom';

interface ProtectedFeatureRouteProps {
  productId: string;
  redirectTo?: string;
}

/**
 * Route wrapper that checks if user has feature before rendering
 */
export function ProtectedFeatureRoute({ productId, redirectTo = '/features' }: ProtectedFeatureRouteProps) {
  const { user } = useAuth();
  const [hasFeature, setHasFeature] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      hasActiveProduct(user.id, productId)
        .then(setHasFeature)
        .finally(() => setLoading(false));
    }
  }, [user, productId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!hasFeature) {
    return <Navigate to={redirectTo} />;
  }

  return <Outlet />;
}

// Usage in routes:
/*
<Route path="/heating" element={<ProtectedFeatureRoute productId="heating-id" />}>
  <Route index element={<HeatingDashboard />} />
  <Route path="settings" element={<HeatingSettings />} />
</Route>
*/
