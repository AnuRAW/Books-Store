import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
function App() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBook, setSelectedBook] = useState(null); // Holds the book for PDF viewing

  const fetchAllBooks = async () => {
    try {
      const response = await axios.get('https://api.npoint.io/dee51ea017d20efdfcc8');
      console.log("API Response:", response.data); // Debug API response
      setBooks(response.data || []);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    fetchAllBooks();
  }, []);

  // Filter books based on search term
  const filteredBooks = books.filter((book) => {
    const nameMatch = book.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const authorMatch = book.author?.toLowerCase().includes(searchTerm.toLowerCase());
    const publishedMatch = book.published?.toString().includes(searchTerm);
    return nameMatch || authorMatch || publishedMatch;
  });

  return (
    <>
      {/* Navbar */}
      <nav className="bg-blue-500 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Books Store</h1>
       {!selectedBook && <input
          type="text"
          placeholder="Search books..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Updates state
          className="px-4 py-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-black"
        />}
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-6">
        {/* Show PDF Viewer if a book is selected */}
        {selectedBook ? (
          <div className="pdf-viewer-container">
            <button
              onClick={() => setSelectedBook(null)}
              className="mb-4 px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600 transition"
            >
              Back to Books
            </button>
            <h2 className="text-xl font-bold mb-2">{selectedBook.name}</h2>
            <p className="text-sm text-gray-600">by {selectedBook.author || "Unknown Author"}</p>
            <p className="text-sm text-gray-500 mb-4">
              Published: {selectedBook.published || "Unknown"}
            </p>
            <iframe
              src={selectedBook.link}
              className="w-full h-screen border"
              title={selectedBook.name}
            ></iframe>
          </div>
        ) : (
          /* Show Books Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredBooks.length > 0 ? (
              filteredBooks.map((book, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 p-6"
                >
                  <h2 className="text-xl font-semibold text-gray-800">{book.name}</h2>
                  <p className="text-sm text-gray-600 mt-2">by {book.author || "Unknown Author"}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Published: {book.published || "Unknown"}
                  </p>
                  <button
                    onClick={() => setSelectedBook(book)} // Set selected book for PDF viewing
                    className="inline-block mt-4 px-6 py-2 text-white bg-blue-600 rounded-full shadow-md hover:bg-blue-700 transition duration-300"
                  >
                    Read book
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600">No books match your search.</p>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default App;
