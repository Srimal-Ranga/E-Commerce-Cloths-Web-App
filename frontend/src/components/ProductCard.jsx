import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <Link to={`/products/${product._id}`} className="product-image-link">
        <img src={product.imageUrl} alt={product.name} className="product-image" />
        <span className="product-category">{product.category}</span>
      </Link>
      
      <div className="product-info">
        <Link to={`/products/${product._id}`}>
          <h3 className="product-name">{product.name}</h3>
        </Link>
        <p className="product-description">{product.description.substring(0, 80)}...</p>
        
        <div className="product-footer">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <Link to={`/products/${product._id}`} className="view-details-btn">
            <ShoppingCart size={18} />
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;