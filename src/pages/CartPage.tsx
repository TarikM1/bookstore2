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

  const updateDetailedCart = () => {
    const storedCartItems = getCartItems();
    setCartItems(storedCartItems);

    if (storedCartItems.length > 0) {
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
          const total = combinedDetails.reduce((sum, item) => sum + (item.subtotal || 0), 0);
          setTotalPrice(total);
        })
        .catch((err) => console.error("Error fetching book data for cart:", err));
    } else {
      setDetailedCartItems([]);
      setTotalPrice(0);
    }
  };

  useEffect(() => {
    updateDetailedCart();
  }, []);

  const handleRemoveFromCart = (bookISBN: string) => {
    removeFromCart(bookISBN);
    updateDetailedCart();
  };

  const handleQuantityChange = (bookISBN: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(event.target.value, 10);

    if (isNaN(newQuantity) || newQuantity < 0) {
      return;
    }

    updateCartItemQuantity(bookISBN, newQuantity);
    updateDetailedCart();
  };

  const handleClearAllCart = () => {
    clearCart();
    setDetailedCartItems([]);
    setTotalPrice(0);
    setOrderPlacedMessage('Your shopping cart has been cleared.');
    setTimeout(() => {
      setOrderPlacedMessage('');
    }, 3000);
  };

  const handlePlaceOrder = (customerData: CustomerData) => {
    const itemsToOrder = detailedCartItems.filter(item => item.quantity > 0);

    if (itemsToOrder.length === 0) {
      setOrderPlacedMessage('Cannot place an empty order. Please add a item.');
      setTimeout(() => setOrderPlacedMessage(''), 5000);
      setIsOrderModalOpen(false);
      return;
    }

    const newOrder: PlacedOrder = {
      orderId: `ORD-${new Date().getTime()}-${Math.floor(Math.random() * 1000)}`,
      customer: customerData,
      items: itemsToOrder.map(item => ({
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
    let textContent = `----- NEW ORDER -----\n`;
    textContent += `Order ID: ${newOrder.orderId}\n`;
    textContent += `Order Date: ${newOrder.orderDate}\n\n`;
    textContent += `Customer Details:\n`;
    textContent += `  Name: ${newOrder.customer.firstName} ${newOrder.customer.lastName}\n`;
    textContent += `  Address: ${newOrder.customer.address}\n`;
    textContent += `  Phone: ${newOrder.customer.phone}\n`;
    textContent += `  Email: ${newOrder.customer.email}\n\n`;
    textContent += `Items:\n`;
    newOrder.items.forEach((item, index) => {
      textContent += `  ${index + 1}. Title: ${item.title}\n`;
      textContent += `    ISBN: ${item.isbn}\n`;
      textContent += `    Quantity: ${item.quantity}\n`;
      textContent += `    Price per item: ${item.price.toFixed(2)} rsd\n`;
      textContent += `    Subtotal: ${item.subtotal.toFixed(2)} rsd\n`;
      if (index < newOrder.items.length - 1) {
        textContent += `      ----------\n`;
      }
    });
    textContent += `\n`;
    textContent += `Total Amount: ${newOrder.totalAmount.toFixed(2)} rsd\n`;
    textContent += `-----------------------\n\n`;

    const blob = new Blob([textContent], { type: 'text/plain' });
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

  if (detailedCartItems.length === 0 && totalPrice === 0) {
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
          isPlaceOrderDisabled={totalPrice === 0}
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
