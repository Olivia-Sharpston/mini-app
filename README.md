# Book Logging App

This is an app that will allow you to keep up with your books and even recommend some to you! This app has the ability to let you add, delete, and edit any entry there is! It's a easy to use app with none of those distracting ads that websites have on the side! You can browse your books in peace.

---

### Inside the Code

This code has several file parts to it, but they all connect back in the end. The book logging app uses the CRUD features, which are create, read, update, and delete. These four simple features can change wonders for a simple app, such as this one. These simple features are what give this app its function!

### Below are some of the CRUD screenshot code snippets:

This is the code snippet for being able to update an entry. You would update an entry by clicking on its generated book ID. By doing this, you can easily update the author, title, or genre of a book!
```js
app.put('/api/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, genre } = req.body;

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid book ID' });
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (author) updateData.author = author;
    if (genre) updateData.genre = genre;

    const result = await db.collection('books').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'book not found' });
    }

    res.json({ 
      message: 'book updated successfully',
      modifiedCount: result.modifiedCount 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update book: ' + error.message });
  }
});
```
---
This is the snippet for adding an entry. Whenever creating a new book, it is required that the author, title, and genre are filled in before creating. Otherwise, the app will not let you create a book until the fields are filled.
```js
app.post('/api/books', async (req, res) => {
  try {
    const { title, author, genre } = req.body;
    
    // Simple validation
    if (!title || !author || !genre) {
      return res.status(400).json({ error: 'Title, author, and genre are required' });
    }

    const book = { title, author, genre };
    const result = await db.collection('books').insertOne(book);
    
    res.status(201).json({ 
      message: 'Book added successfully',
      bookId: result.insertedId,
      book: { ...book, _id: result.insertedId }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add book: ' + error.message });
  }
});
```
---
This is one of two delete functions. The reason there are two is because you can delete the entire collection of books that are listed or just one book can be deleted. This means that two functions are put in to control what each delete button does. Below is the delete function for deleting all of the books.
```js
app.delete('/api/books', async (req, res) => {
  try {
    const result = await db.collection('books').deleteMany({});
    res.json({ message: `Deleted ${result.deletedCount} books.` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete books: ' + error.message });
  }
});
```
This is the function for deleting only one book in the collection.
```js
app.delete('/api/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.collection('books').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete book: ' + error.message });
  }
});
```

