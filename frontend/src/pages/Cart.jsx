import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService } from '../services/cartService';
import { useAuth } from '../context/AuthContext';
import CartItem from '../components/CartItem';
import toast from 'react-hot-toast';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

const Cart = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  const { data: cartData, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: cartService.getCart,
  });

  const updateQuantityMutation = useMutation({
    mutationFn: ({ itemId, quantity }) =>
      cartService.updateCartItem(itemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries(['cart']);
      toast.success('Cart updated');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update cart');
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: cartService.removeFromCart,
    onSuccess: () => {
      queryClient.invalidateQueries(['cart']);
      toast.success('Item removed from cart');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to remove item');
    },
  });

  const handleUpdateQuantity = (itemId, quantity) => {
    updateQuantityMutation.mutate({ itemId, quantity });
  };

  const handleRemoveItem = (itemId) => {
    if (window.confirm('Are you sure you want to remove this item?')) {
      removeItemMutation.mutate(itemId);
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please login to proceed with checkout');
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading cart...</p>
      </div>
    );
  }

  const cart = cartData?.data;
  const items = cart?.items || [];
  const totalPrice = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  if (items.length === 0) {
    return (
      <div className="empty-cart">
        <ShoppingBag size={64} />
        <h2>Your cart is empty</h2>
        <p>Add some items to get started!</p>
        <button onClick={() => navigate('/')} className="continue-shopping-btn">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <button onClick={() => navigate(-1)} className="back-btn">
          <ArrowLeft size={18} />
          Back
        </button>

        <h1>Shopping Cart</h1>
        <p className="cart-subtitle">
          You have {items.length} item{items.length !== 1 ? 's' : ''} in your cart
        </p>

        <div className="cart-content">
          <div className="cart-items-section">
            {items.map((item) => (
              <CartItem
                key={item._id}
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemoveItem}
              />
            ))}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>
            
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            
            <div className="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            
            <div className="summary-row">
              <span>Tax</span>
              <span>Calculated at checkout</span>
            </div>
            
            <div className="summary-divider"></div>
            
            <div className="summary-row total">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>

            <button onClick={handleCheckout} className="checkout-btn">
              Proceed to Checkout
            </button>

            <button
              onClick={() => navigate('/')}
              className="continue-shopping-link"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;