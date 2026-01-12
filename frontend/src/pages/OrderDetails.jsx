import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { orderService } from '../services/orderService';
import { ArrowLeft, Package, CheckCircle } from 'lucide-react';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ['order', id],
    queryFn: () => orderService.getOrderById(id),
  });

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading order details...</p>
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="error-container">
        <p>Order not found</p>
        <button onClick={() => navigate('/orders')} className="back-btn">
          Back to Orders
        </button>
      </div>
    );
  }

  const order = data.data;

  return (
    <div className="order-details-page">
      <div className="container">
        <button onClick={() => navigate('/orders')} className="back-btn">
          <ArrowLeft size={18} />
          Back to Orders
        </button>

        <div className="order-success-message">
          <CheckCircle size={48} />
          <h1>Order Confirmed!</h1>
          <p>Thank you for your purchase. We've sent a confirmation email.</p>
        </div>

        <div className="order-details-container">
          <div className="order-info-section">
            <div className="info-card">
              <h2>
                <Package size={24} />
                Order Information
              </h2>
              <div className="info-row">
                <span>Order ID:</span>
                <span>#{order._id.slice(-8)}</span>
              </div>
              <div className="info-row">
                <span>Order Date:</span>
                <span>
                  {new Date(order.orderDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <div className="info-row">
                <span>Status:</span>
                <span className={`status-badge ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>
            </div>
          </div>

          <div className="order-items-section">
            <h2>Order Items</h2>
            <div className="order-items-list">
              {order.items.map((item) => (
                <div key={item._id} className="order-detail-item">
                  <img
                    src={item.product?.imageUrl}
                    alt={item.name}
                    className="order-detail-item-image"
                  />
                  <div className="order-detail-item-info">
                    <h3>{item.name}</h3>
                    <p>Size: {item.size}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p className="item-price">${item.price.toFixed(2)} each</p>
                  </div>
                  <div className="order-detail-item-total">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="order-summary-section">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${order.totalPrice.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="summary-row">
                <span>Tax</span>
                <span>$0.00</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row total">
                <span>Total</span>
                <span>${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="order-actions">
          <button onClick={() => navigate('/')} className="continue-shopping-btn">
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;