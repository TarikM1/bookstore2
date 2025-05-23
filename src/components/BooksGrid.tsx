import React, { useState } from 'react';
import BookCard, { BookWithDescription } from './Bookcard';
import BookDescriptionModal from './BookDescriptionModal';

interface BooksGridProps {
  books: BookWithDescription[];
}

const BooksGrid: React.FC<BooksGridProps> = ({ books }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDescription, setCurrentDescription] = useState('');
  const [currentTitle, setCurrentTitle] = useState('');

  const handleShowDescription = (book: BookWithDescription) => {
    setCurrentDescription(book.description);
    setCurrentTitle(book.title);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentDescription('');
    setCurrentTitle('');
  };

  return (
    <div>
      <h1>Riverstone Books</h1>
      <div className="main">
        <ul className="cards">
          {books.map(book => (
            <BookCard
              key={book.isbn}
              book={book}
              onShowDescription={handleShowDescription}
            />
          ))}
        </ul>
      </div>

      <BookDescriptionModal
        isOpen={isModalOpen}
        description={currentDescription}
        title={currentTitle}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default BooksGrid;