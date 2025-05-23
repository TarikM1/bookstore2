import React, { useState, useEffect } from 'react';
import { getCartItems, removeFromCart, updateCartItemQuantity, clearCart } from '../cartComp/CartUtils';
import { Book } from '../components/Bookcard';
import CartItemsList from '../cartComp/CartItemsList';
import CartSummary from '../cartComp/CartSummary';
import EmptyCartMessage from '../cartComp/EmptyCartMessage';
import '../CartPage.css';
import OrderModal from '../components/OrderModal';

interface CartItem {
  id: string;
  quantity: number;
}

interface DetailedCartItem extends Book {
  quantity: number;
  subtotal: number;
}

interface CustomerData {
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  email: string;
}

interface PlacedOrder {
  orderId: string;
  customer: CustomerData;
  items: {
    isbn: string;
    title: string;
    quantity: number;
    price: number;
    subtotal: number;
  }[];
  totalAmount: number;
  orderDate: string;
}


function CartPage() {
  const [, setCartItems] = useState<CartItem[]>([]);
  const [detailedCartItems, setDetailedCartItems] = useState<DetailedCartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderPlacedMessage, setOrderPlacedMessage] = useState('');

  useEffect(() => {
    const storedCartItems = getCartItems();
    setCartItems(storedCartItems);

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
    setCartItems(prevItems => prevItems.filter(item => item.id !== bookISBN));
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
    alert('Your shopping cart has been cleared.');
  };

  const handlePlaceOrder = (customerData: CustomerData) => {
    const newOrder: PlacedOrder = {
      orderId: `ORD-${new Date().getTime()}-${Math.floor(Math.random() * 1000)}`,
      customer: customerData,
      items: detailedCartItems.map(item => ({
        isbn: item.isbn,
        title: item.title,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.subtotal
      })),
      totalAmount: totalPrice,
      orderDate: new Date().toLocaleString()
    };

    const existingOrders: PlacedOrder[] = JSON.parse(localStorage.getItem('placedOrders') || '[]');
    existingOrders.push(newOrder);
    localStorage.setItem('placedOrders', JSON.stringify(existingOrders));

    const fileName = `order_${newOrder.orderId}.txt`;
    const jsonContent = JSON.stringify(newOrder, null, 2); 

    const blob = new Blob([jsonContent], { type: 'application/json' });
    const href = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = href;
    link.download = fileName; 
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(href);

    setOrderPlacedMessage('Your order has been successfully placed');

    clearCart();
    setDetailedCartItems([]);
    setTotalPrice(0);
    setIsOrderModalOpen(false);

    setTimeout(() => {
      setOrderPlacedMessage('');
    }, 5000);
  };


  if (detailedCartItems.length === 0) {
    return (
      <div className="cart-page">
        <h1>Your Shopping Cart</h1>
        {orderPlacedMessage && (
          <div className="order-success-message">
            {orderPlacedMessage}
          </div>
        )}
        <EmptyCartMessage />
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Your Shopping Cart</h1>

      {orderPlacedMessage && (
        <div className="order-success-message">
          {orderPlacedMessage}
        </div>
      )}

      <div className="cart-overall-container">
        <CartItemsList
          items={detailedCartItems}
          onQuantityChange={handleQuantityChange}
          onRemove={handleRemoveFromCart}
        />

        <CartSummary
          totalPrice={totalPrice}
          onPlaceOrder={() => setIsOrderModalOpen(true)}
          onClearCart={handleClearAllCart}
        />
      </div>

      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        onPlaceOrder={handlePlaceOrder}
        totalPrice={totalPrice}
      />
    </div>
  );
}

export default CartPage;