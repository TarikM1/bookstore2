interface CartItem {
  id: string;
  quantity: number;
}

interface BookForCart {
  isbn: string;
  title: string;
  author: string;
  image: string;
  price: number;
}

const CART_STORAGE_KEY = 'cartItems';

export const getCartItems = (): CartItem[] => {
  const storedItems = localStorage.getItem(CART_STORAGE_KEY);
  return storedItems ? JSON.parse(storedItems) : [];
};

export const saveCartItems = (items: CartItem[]) => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
};

export const addToCart = (book: BookForCart) => {
  const cartItems = getCartItems();
  const existingItemIndex = cartItems.findIndex(item => item.id === book.isbn);

  if (existingItemIndex !== -1) {
    cartItems[existingItemIndex].quantity++;
  } else {
    cartItems.push({ id: book.isbn, quantity: 1 });
  }
  saveCartItems(cartItems);
};

export const removeFromCart = (bookISBN: string) => {
  let cartItems = getCartItems();
  cartItems = cartItems.filter(item => item.id !== bookISBN);
  saveCartItems(cartItems);
};

export const updateCartItemQuantity = (bookISBN: string, newQuantity: number) => {
  let cartItems = getCartItems();
  const itemIndex = cartItems.findIndex(item => item.id === bookISBN);

  if (itemIndex > -1) {
    if (newQuantity >= 0) {
      cartItems[itemIndex].quantity = newQuantity;
    } else {
      cartItems[itemIndex].quantity = 0;
    }
  }
  saveCartItems(cartItems);
};

export const clearCart = () => {
  localStorage.removeItem(CART_STORAGE_KEY);
};