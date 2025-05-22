import React from 'react';
import { addToCart } from '../cartComp/CartUtils';

export interface Book {
  isbn: string;
  title: string;
  author: string;
  image: string;
  price: number;
}

export interface BookWithDescription extends Book {
  description: string;
  numberOfPages?: string;
  yearOfPublishing?: string;
  publisher?: string;
  language?: string;
  rating?: number;
  alphabet?: string;
  cover?: string;
}

interface BookCardProps {
  book: BookWithDescription;
  onShowDescription: (book: BookWithDescription) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onShowDescription }) => {
  const handleAddToCart = () => {
    const { description, numberOfPages, yearOfPublishing, publisher, language, rating, alphabet, cover, ...bookForCart } = book;
    addToCart(bookForCart);
    alert(`${book.title} added to cart!`);
  };

  const handleShowDescriptionClick = () => {
    onShowDescription(book);
  };

  return (
    <li className="cards_item">
      <div className="card horizontal">
        <div className="book_image" onClick={handleShowDescriptionClick}>
          <img src={book.image} alt={book.title} />
        </div>
        <div className="card_content">
          <h2 className="card_title" onClick={handleShowDescriptionClick}>
            {book.title}
          </h2>
          <p className="card_author">Author: {book.author}</p>
          <p className="card_price_text">Price: {book.price.toFixed(2)} rsd</p>
          <button className="add_to_cart" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </li>
  );
};

export default BookCard;