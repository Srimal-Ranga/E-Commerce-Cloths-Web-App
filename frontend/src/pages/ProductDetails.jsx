import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../services/productService';
import { cartService } from '../services/cartService';
import toast from 'react-hot-toast';
import { ShoppingCart, ArrowLeft } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProductById(id),
  });

  const addToCartMutation = useMutation({
    mutationFn: cartService.addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries(['cart']);
      toast.success('Added to cart successfully!');
      navigate('/cart');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    },
  });

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }

    addToCartMutation.mutate({
      productId: id,
      size: selectedSize,
      quantity,
    });
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading product...</p>
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="error-container">
        <p>Product not found</p>
        <button onClick={() => navigate('/')} className="back-btn">
          Go back to home
        </button>
      </div>
    );
  }

  const product = data.data;

  return (
    <div className="product-details-page">
      <div className="container">
        <button onClick={() => navigate(-1)} className="back-btn">
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="product-details-container">
          <div className="product-image-section">
            <img src={product.imageUrl} alt={product.name} />
          </div>

          <div className="product-info-section">
            <span className="product-category-badge">{product.category}</span>
            <h1>{product.name}</h1>
            <p className="product-price">${product.price.toFixed(2)}</p>
            <p className="product-description">{product.description}</p>

            <div className="product-options">
              <div className="size-selector">
                <label>Select Size:</label>
                <div className="size-buttons">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="quantity-selector">
                <label>Quantity:</label>
                <div className="quantity-input">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    min="1"
                  />
                  <button onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="add-to-cart-btn"
              disabled={addToCartMutation.isLoading}
            >
              <ShoppingCart size={20} />
              {addToCartMutation.isLoading ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;