import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService } from '../services/cartService';
import { orderService } from '../services/orderService';
import toast from 'react-hot-toast';
import { CreditCard, ArrowLeft } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const { data: cartData, isLoading: cartLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: cartService.getCart,
  });

  const checkoutMutation = useMutation({
    mutationFn: orderService.checkout,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['cart']);
      queryClient.invalidateQueries(['orders']);
      toast.success('Order placed successfully! Check your email for confirmation.');
      navigate(`/orders/${data.data._id}`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Checkout failed');
    },
  });

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await checkoutMutation.mutateAsync();
    } finally {
      setLoading(false);
    }
  };

  if (cartLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
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
    navigate('/cart');
    return null;
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <button onClick={() => navigate('/cart')} className="back-btn">
          <ArrowLeft size={18} />
          Back to Cart
        </button>

        <h1>Checkout</h1>

        <div className="checkout-content">
          <div className="checkout-form-section">
            <form onSubmit={handleCheckout}>
              <div className="checkout-section">
                <h2>Order Summary</h2>
                <div className="order-items">
                  {items.map((item) => (
                    <div key={item._id} className="checkout-item">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="checkout-item-image"
                      />
                      <div className="checkout-item-info">
                        <h4>{item.product.name}</h4>
                        <p>Size: {item.size} | Qty: {item.quantity}</p>
                      </div>
                      <div className="checkout-item-price">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="checkout-section">
                <h2>Payment Information</h2>
                <p className="mock-payment-notice">
                  <CreditCard size={20} />
                  This is a mock checkout. No real payment will be processed.
                </p>
              </div>