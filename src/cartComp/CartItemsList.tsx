import React from 'react';
import CartItemCard from './CartItemCard';
import { Book } from '../components/Bookcard'; 

interface DetailedCartItem extends Book {
  quantity: number;
  subtotal: number;
}

interface CartItemsListProps {
  items: DetailedCartItem[];
  onQuantityChange: (isbn: string, event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (isbn: string) => void;
}

const CartItemsList: React.FC<CartItemsListProps> = ({ items, onQuantityChange, onRemove }) => {
  return (
    <div className="cart-items-section">
      <h1 className="cart-section-title">Your Items</h1>
      <ul className="cart-book-list">
        {items.map(item => (
          <CartItemCard
            key={item.isbn}
            item={item}
            onQuantityChange={onQuantityChange}
            onRemove={onRemove}
          />
        ))}
      </ul>
    </div>
  );
};

export default CartItemsList;