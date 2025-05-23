import React, { useState, useEffect } from "react";
import BooksGrid from "../components/BooksGrid";
import { BookWithDescription } from '../components/Bookcard';
import '../Main.css';

function MainPage() {
  const [books, setBooks] = useState<BookWithDescription[]>([]);

  useEffect(() => {
    fetch('/podaci_knjizare-sš.json')
      .then((res) => {
        if (!res.ok) throw new Error("Error fetching book data");
        return res.json();
      })
      .then((data: BookWithDescription[]) => {
        setBooks(data);
      })
      .catch((err) => console.error("Error fetching book data:", err));
  }, []);

  return (
    <div>
      <BooksGrid books={books} /> { }
    </div>
  );
}

export default MainPage;