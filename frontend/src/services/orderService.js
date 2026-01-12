import api from './api';

export const orderService = {
  // Create order (checkout)
  checkout: async () => {
    const response = await api.post('/orders/checkout');
    return response.data;
  },

  // Get all user orders
  getOrders: async (params = {}) => {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  // Get single order by ID
  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
};