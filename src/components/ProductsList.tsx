import { useEffect, useState } from 'react';
import { getProductsWithStatus, toggleUserProduct } from '../services/products.service';
import { getCurrentUser } from '../lib/supabase';
import { ProductModule } from '../models/product.model';
import './ProductsList.css';

export function ProductsList() {
  const [products, setProducts] = useState<ProductModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setError(null);
      const user = await getCurrentUser();
      if (!user) {
        setError('Not authenticated');
        return;
      }
      
      setUserId(user.id);
      const data = await getProductsWithStatus();
      setProducts(data);
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (productId: string, currentStatus: string) => {
    if (!userId) return;

    try {
      // Toggle: active <-> inactive
      const newStatus = currentStatus === 'ACTIVE' ? 'inactive' : 'active';
      
      await toggleUserProduct(userId, productId, newStatus);
      
      // Update UI
      setProducts(prev =>
        prev.map(p =>
          p.id === productId
            ? { 
                ...p, 
                status: newStatus === 'active' ? 'ACTIVE' : 'INACTIVE',
                isActive: newStatus === 'active',
                isPaused: false,
              }
            : p
        )
      );
    } catch (err) {
      console.error('Error toggling feature:', err);
      setError('Failed to update feature');
      // Reload to restore correct state
      setTimeout(() => loadProducts(), 1000);
    }
  };

  if (loading) {
    return (
      <div className="products-list-loading">
        <div className="spinner"></div>
        <p>Loading features...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-list-error">
        <p className="error-message">{error}</p>
        <button onClick={loadProducts} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="products-list">
      <div className="products-list-header">
        <h2>Available Features</h2>
        <p className="subtitle">Enable or disable features for your account</p>
      </div>
      
      <div className="products-grid">
        {products.map(product => (
          <div 
            key={product.id} 
            className={`product-card ${product.status.toLowerCase()}`}
          >
            <div className="product-header">
              <div className="product-title-section">
                <h3 className="product-name">{product.name}</h3>
                <span className={`category-badge ${product.category.toLowerCase()}`}>
                  {product.category}
                </span>
              </div>
              
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={product.isActive}
                  disabled={product.isPaused}
                  onChange={() => handleToggle(product.id, product.status)}
                  aria-label={`Toggle ${product.name}`}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            
            <p className="product-description">{product.description}</p>
            
            <div className="product-footer">
              <div className="product-meta">
                <span className="credit-cost">
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 16 16" 
                    fill="none"
                    className="credit-icon"
                  >
                    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2"/>
                    <text x="8" y="11" textAnchor="middle" fontSize="10" fill="currentColor">€</text>
                  </svg>
                  {product.creditCost} credits
                </span>
                
                <span className={`status-badge ${product.status.toLowerCase()}`}>
                  {product.status}
                </span>
              </div>
              
              {product.requiresExternal && (
                <div className="requires-external">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path 
                      d="M13 3L4 14h7l-1 7 9-11h-7l1-7z" 
                      stroke="currentColor" 
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Requires external integration
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {products.length === 0 && (
        <div className="empty-state">
          <p>No products available</p>
        </div>
      )}
    </div>
  );
}
