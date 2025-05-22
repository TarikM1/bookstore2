import React from 'react';
import { Book } from '../components/Bookcard'; 

interface DetailedCartItem extends Book {
  quantity: number;
  subtotal: number;
}

interface CartItemCardProps {
  item: DetailedCartItem;
  onQuantityChange: (isbn: string, event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (isbn: string) => void;
}

const CartItemCard: React.FC<CartItemCardProps> = ({ item, onQuantityChange, onRemove }) => {
  return (
    <li className="cart-book-item">
      <div className="cart-book-card">
        <div className="cart-book-image-container">
          <img src={item.image} alt={item.title} />
        </div>
        <div className="cart-book-card-content">
          <h2 className="cart-book-title">{item.title}</h2>
          <p className="cart-book-author">Author: {item.author}</p>
          <p className="cart-book-price-text">Price: {item.price.toFixed(2)} rsd</p>

          <div className="cart-quantity-controls">
            Quantity:
            <input
              type="number"
              value={item.quantity}
              min="0"
              onChange={(e) => onQuantityChange(item.isbn, e)}
              className="cart-quantity-input"
            />
          </div>
          <p className="cart-item-subtotal-display">Subtotal: {item.subtotal.toFixed(2)} rsd</p>
          <button
            onClick={() => onRemove(item.isbn)}
            className="cart-item-remove-button"
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  );
};

export default CartItemCard;