import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { orderService } from '../services/orderService';
import { useNavigate } from 'react-router-dom';
import { Package, Eye } from 'lucide-react';
import Pagination from '../components/Pagination';

const Orders = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['orders', page],
    queryFn: () => orderService.getOrders({ page, limit: 10 }),
    keepPreviousData: true,
  });

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  const orders = data?.data || [];

  if (orders.length === 0) {
    return (
      <div className="empty-orders">
        <Package size={64} />
        <h2>No orders yet</h2>
        <p>Start shopping to see your orders here!</p>
        <button onClick={() => navigate('/')} className="shop-now-btn">
          Shop Now
        </button>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="container">
        <h1>My Orders</h1>
        <p className="orders-subtitle">
          You have {data?.total} order{data?.total !== 1 ? 's' : ''}
        </p>

        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div>
                  <h3>Order #{order._id.slice(-8)}</h3>
                  <p className="order-date">
                    {new Date(order.orderDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <span className={`order-status ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>

              <div className="order-items">
                {order.items.slice(0, 3).map((item) => (
                  <div key={item._id} className="order-item-preview">
                    <img
                      src={item.product?.imageUrl}
                      alt={item.name}
                      className="order-item-image"
                    />
                    <div className="order-item-info">
                      <p>{item.name}</p>
                      <p className="order-item-details">
                        Size: {item.size} | Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
                {order.items.length > 3 && (
                  <p className="more-items">+{order.items.length - 3} more items</p>
                )}
              </div>

              <div className="order-footer">
                <div className="order-total">
                  <span>Total:</span>
                  <span className="order-price">${order.totalPrice.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => navigate(`/orders/${order._id}`)}
                  className="view-order-btn"
                >
                  <Eye size={18} />
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {data && data.pages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={data.pages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default Orders;