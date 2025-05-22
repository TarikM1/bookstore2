import React from 'react';

const EmptyCartMessage: React.FC = () => {
  return (
    <div className="cart-overall-container">
      <h1 className="cart-section-title">Shopping Cart</h1>
      <p className="cart-empty-message">Your cart is empty.</p>
    </div>
  );
};

export default EmptyCartMessage;