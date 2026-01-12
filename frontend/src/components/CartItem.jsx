import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const handleDecrease = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item._id, item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    onUpdateQuantity(item._id, item.quantity + 1);
  };

  return (
    <div className="cart-item">
      <img src={item.product.imageUrl} alt={item.product.name} className="cart-item-image" />
      
      <div className="cart-item-details">
        <h3>{item.product.name}</h3>
        <p className="cart-item-size">Size: {item.size}</p>
        <p className="cart-item-price">${item.product.price.toFixed(2)}</p>
      </div>

      <div className="cart-item-actions">
        <div className="quantity-controls">
          <button onClick={handleDecrease} className="quantity-btn">
            <Minus size={16} />
          </button>
          <span className="quantity">{item.quantity}</span>
          <button onClick={handleIncrease} className="quantity-btn">
            <Plus size={16} />
          </button>
        </div>

        <button onClick={() => onRemove(item._id)} className="remove-btn">
          <Trash2 size={18} />
        </button>
      </div>

      <div className="cart-item-subtotal">
        ${(item.product.price * item.quantity).toFixed(2)}
      </div>
    </div>
  );
};

export default CartItem;