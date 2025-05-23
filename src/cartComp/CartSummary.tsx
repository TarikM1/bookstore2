import React from 'react';

interface CartSummaryProps {
  totalPrice: number;
  onPlaceOrder: () => void;
  onClearCart: () => void;
  isPlaceOrderDisabled: boolean; 
}

const CartSummary: React.FC<CartSummaryProps> = ({ totalPrice, onPlaceOrder, onClearCart, isPlaceOrderDisabled }) => {
  return (
    <div className="cart-summary-section">
      <h2>Order Summary</h2>
      <h2 className="cart-total-price-display">Total Price: {totalPrice.toFixed(2)} rsd</h2>
      <div className="cart-action-buttons">
        <button
          onClick={onPlaceOrder}
          className={`cart-place-order-button ${isPlaceOrderDisabled ? 'disabled-button' : ''}`}
          disabled={isPlaceOrderDisabled}
        >
          Place Order
        </button>
        <button
          onClick={onClearCart}
          className="cart-clear-button"
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
};

export default CartSummary;