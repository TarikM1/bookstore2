import React, { useState, useEffect } from 'react';
import { getCartItems, removeFromCart, updateCartItemQuantity, clearCart } from '../cartComp/CartUtils';
import { Book } from '../components/Bookcard';
import CartItemsList from '../cartComp/CartItemsList'; 
import CartSummary from '../cartComp/CartSummary';
import EmptyCartMessage from '../cartComp/EmptyCartMessage';
import '../CartPage.css';

interface CartItem {
  id: string;
  quantity: number;
}

interface DetailedCartItem extends Book {
  quantity: number;
  subtotal: number;
}

function CartPage() {
  const [detailedCartItems, setDetailedCartItems] = useState<DetailedCartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const storedCartItems = getCartItems();
    if (storedCartItems.length >= 0) {
      fetch('/podaci_knjizare-sš.json')
        .then((res) => {
          if (!res.ok) throw new Error("Error fetching book data");
          return res.json();
        })
        .then((allBooks: any[]) => {
          const combinedDetails: DetailedCartItem[] = storedCartItems
            .map(item => {
              const book = allBooks.find(b => b.isbn === item.id);
              if (book) {
                return {
                  isbn: book.isbn,
                  title: book.title,
                  author: book.author,
                  image: book.image,
                  price: book.price,
                  quantity: item.quantity,
                  subtotal: book.price * item.quantity
                };
              }
              return null;
            })
            .filter((item): item is DetailedCartItem => item !== null);

          setDetailedCartItems(combinedDetails);
        })
        .catch((err) => console.error("Error fetching book data for cart:", err));
    } else {
      setDetailedCartItems([]);
    }
  }, []);

  useEffect(() => {
    const total = detailedCartItems.reduce((sum, item) => sum + (item.subtotal || 0), 0);
    setTotalPrice(total);
  }, [detailedCartItems]);

  const handleRemoveFromCart = (bookISBN: string) => {
    removeFromCart(bookISBN);
    setDetailedCartItems(prevDetails => prevDetails.filter(item => item.isbn !== bookISBN));
  };

  const handleQuantityChange = (bookISBN: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(event.target.value, 10);

    if (!isNaN(newQuantity) && newQuantity >= 0) {
      updateCartItemQuantity(bookISBN, newQuantity);

      fetch('/podaci_knjizare-sš.json')
        .then((res) => res.json())
        .then((allBooks: any[]) => {
          const updatedDetailedCartItems = getCartItems()
            .map(item => {
              const book = allBooks.find(b => b.isbn === item.id);
              if (book) {
                return {
                  isbn: book.isbn,
                  title: book.title,
                  author: book.author,
                  image: book.image,
                  price: book.price,
                  quantity: item.quantity,
                  subtotal: book.price * item.quantity
                };
              }
              return null;
            })
            .filter((item): item is DetailedCartItem => item !== null);
          setDetailedCartItems(updatedDetailedCartItems);
        })
        .catch(err => console.error("Error updating cart details after quantity change:", err));
    }
  };

  const handleClearAllCart = () => {
    clearCart();
    setDetailedCartItems([]);
    setTotalPrice(0);
  };

  const handlePlaceOrder = () => {
    alert("No function :)");
  };

  if (detailedCartItems.length === 0) {
    return <EmptyCartMessage />;
  }

  return (
    <div className="cart-overall-container">
      <CartItemsList
        items={detailedCartItems}
        onQuantityChange={handleQuantityChange}
        onRemove={handleRemoveFromCart}
      />

      <CartSummary
        totalPrice={totalPrice}
        onPlaceOrder={handlePlaceOrder}
        onClearCart={handleClearAllCart}
      />
    </div>
  );
}

export default CartPage;