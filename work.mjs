// for .env - cg8yvmk or taug6

import 'dotenv/config'
import express from 'express'
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';


const app = express()
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uri = process.env.MONGO_URI;
console.log("get .env uri:", uri);

app.use(express.urlencoded({ extended: true })); // Parse form data 
app.use(express.static(join(__dirname, 'public')));
app.use(express.json());

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Keep the connection open for our CRUD operations
let db;
async function connectDB(){
  try{
    await client.connect();
    db = client.db("school"); // Database Name
    console.log("Connect to MongoDB!");
  } catch (error){
    console.error("Failed to connect to MongoDB:", error);
  }
}
connectDB();

// send to an html file
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'app.html')) 
})

app.get('/api/app', (req, res) => {
  const myVar = 'Hello from server!';
  res.json({ myVar });
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})

app.get('/api/books', async (req, res) => {
  try {
    const books = await db.collection('books').find().toArray();
    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

app.delete('/api/books/:id', async (req, res) => {
  try {
    const result = await db.collection('books').deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 1) {
      res.status(200).json({ message: 'Book deleted' });
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ error: 'Failed to delete book' });
  }
});



connectDB();