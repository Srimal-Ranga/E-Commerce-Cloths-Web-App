import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, User, LogOut, Package, Menu, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { cartService } from '../services/cartService';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Get cart count
  const { data: cartData } = useQuery({
    queryKey: ['cart'],
    queryFn: cartService.getCart,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const cartItemsCount = cartData?.data?.items?.reduce(
    (total, item) => total + item.quantity,
    0
  ) || 0;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          Clothing Store
        </Link>

        {/* Mobile menu button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navigation links */}
        <div className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
          <Link to="/" onClick={() => setMobileMenuOpen(false)}>
            Home
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/orders" onClick={() => setMobileMenuOpen(false)}>
                <Package size={18} />
                Orders
              </Link>
              <Link to="/cart" onClick={() => setMobileMenuOpen(false)}>
                <ShoppingCart size={18} />
                Cart {cartItemsCount > 0 && `(${cartItemsCount})`}
              </Link>
              <div className="user-menu">
                <User size={18} />
                <span>{user?.name}</span>
                <button onClick={handleLogout} className="logout-btn">
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/cart" onClick={() => setMobileMenuOpen(false)}>
                <ShoppingCart size={18} />
                Cart {cartItemsCount > 0 && `(${cartItemsCount})`}
              </Link>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;