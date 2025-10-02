document.addEventListener('DOMContentLoaded', () => {
  const bookList = document.getElementById('bookList');

  // Load books from server
  fetch('/api/books')
    .then(response => response.json())
    .then(books => {
      bookList.innerHTML = books.map(book => `
        <div class="book" data-id="${book._id}">
          <h3>${book.title}</h3>
          <p><strong>Author:</strong> ${book.author}</p>
          <p><strong>Genre:</strong> ${book.genre}</p>
          <button class="delete-btn" data-id="${book._id}">Delete</button>
        </div>
      `).join('');
    })
    .catch(error => {
      console.error("❌ Error loading books:", error);
    });
});
